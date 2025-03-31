#!/usr/bin/env node
import { execSync } from 'child_process';
import fs from 'fs';
import readline from 'readline';
import semver from 'semver';

// Create readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Helper function to execute shell commands
function runCommand(command, options = {}) {
    try {
        console.log(`Running: ${command}`);
        return execSync(command, { stdio: 'inherit', ...options });
    } catch (error) {
        console.error(`Error executing command: ${command}`);
        process.exit(1);
    }
}

// Validate version format
function validateVersion(version) {
    if (!semver.valid(version)) {
        console.error(`Invalid version format: ${version}. Please use semantic versioning (e.g., 1.2.3)`);
        process.exit(1);
    }
}

// Check if changelog has the version entry
function checkChangelog(version) {
    try {
        const changelog = fs.readFileSync('doc/changelog.md', 'utf8');
        const versionPattern = new RegExp(`^## \\[${version}\\]`, 'm');

        if (!versionPattern.test(changelog)) {
            console.error(`doc/changelog.md doesn't contain an entry for version ${version}`);
            console.error('Please add a section like:');
            console.error(`## [${version}] - Your release title`);
            console.error('- Your changes here');
            process.exit(1);
        }

        // Extract the release title for later use
        const match = changelog.match(new RegExp(`^## \\[${version}\\] - (.+)$`, 'm'));
        return match ? match[1] : '';
    } catch (error) {
        console.error('Error reading doc/changelog.md:', error.message);
        process.exit(1);
    }
}

// Update package.json version
function updatePackageJson(version) {
    try {
        const packageJsonPath = './package.json';
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        packageJson.version = version;
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
        console.log(`Updated package.json to version ${version}`);
    } catch (error) {
        console.error('Error updating package.json:', error.message);
        process.exit(1);
    }
}

async function handleUmlGeneration(version) {
    try {
        console.log('Generating UML diagrams...');
        runCommand('npm run generate-uml');

        const umlDirExists = fs.existsSync('doc/diagrams');
        if (!umlDirExists) {
            console.log('No doc/diagrams directory found - skipping UML commit');
            return;
        }

        // Check for actual content changes (ignoring whitespace)
        const changes = execSync('git diff --ignore-cr-at-eol --ignore-space-at-eol --ignore-all-space --ignore-blank-lines --numstat doc/diagrams').toString();

        if (changes.trim() === '') {
            console.log('Only whitespace changes in UML diagrams - skipping commit');
            // Reset any potential line ending changes
            execSync('git checkout -- doc/diagrams', { stdio: 'ignore' });
            return;
        }

        runCommand('git add doc/diagrams');
        runCommand(`git commit -m "docs: generate all class diagrams uml for ${version}"`);
    } catch (error) {
        console.error('Error handling UML generation:', error.message);
    }
}

async function runTests() {
    try {
        execSync('npm test -- --watch=false', { stdio: 'inherit' });
    } catch (testError) {
        console.error('Tests failed!');
        process.exit(1);
    }
}

async function main() {
    // Store original environment variables
    const originalEnv = {
        GIT_MERGE_AUTOEDIT: process.env.GIT_MERGE_AUTOEDIT,
        GIT_EDITOR: process.env.GIT_EDITOR,
        EDITOR: process.env.EDITOR
    };

    try {
        const version = process.argv[2];

        if (!version) {
            console.error('Please provide a version number as an argument (e.g., 1.2.3)');
            process.exit(1);
        }

        validateVersion(version);
        console.log(`Starting release process for version ${version}`);

        const releaseTitle = checkChangelog(version);
        if (!releaseTitle) {
            console.error('Could not determine release title from changelog.md');
            process.exit(1);
        }

        // Configure environment to prevent editor opening
        process.env.GIT_MERGE_AUTOEDIT = 'no';
        process.env.GIT_EDITOR = 'true';
        process.env.EDITOR = 'true';

        // Step 2: Start git flow release
        runCommand(`git flow release start ${version}`);

        // Step 3: Update package.json and package-lock.json
        updatePackageJson(version);
        runCommand('npm i');
        runCommand('git add package.json package-lock.json');
        runCommand(`git commit -m "chore: bump version to ${version}"`);

        await handleUmlGeneration(version);

        // Step 5: Run tests and build
        await runTests();
        runCommand('npm run build');

        // Step 6: Finish release with editor bypass
        const tagMessage = `${version}: ${releaseTitle}`;
        runCommand(`git flow release finish -m "Release ${version}" -T "${tagMessage}" -S ${version}`, {
            env: {
                ...process.env,
                GIT_MERGE_AUTOEDIT: 'no',
                GIT_EDITOR: 'true',
                EDITOR: 'true'
            }
        });

        // Step 7: Push everything
        runCommand('git push origin main');
        runCommand('git push origin develop');
        runCommand('git push --tags');

        console.log(`\n🎉 Successfully released version ${version}: ${releaseTitle}`);
    } finally {
        // Restore original environment variables
        process.env.GIT_MERGE_AUTOEDIT = originalEnv.GIT_MERGE_AUTOEDIT;
        process.env.GIT_EDITOR = originalEnv.GIT_EDITOR;
        process.env.EDITOR = originalEnv.EDITOR;
        rl.close();
    }
}

main().catch((error) => {
    console.error('Release failed:', error);
    process.exit(1);
});