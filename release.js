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

        const umlDirExists = fs.existsSync('docs/uml');
        if (!umlDirExists) {
            console.log('No docs/uml directory found - skipping UML commit');
            return;
        }

        const statusOutput = execSync('git status --porcelain docs/uml').toString();
        if (statusOutput.trim() === '') {
            console.log('No changes in UML diagrams - skipping commit');
            return;
        }

        runCommand('git add docs/uml');
        runCommand(`git commit -m "Update UML diagrams for ${version}"`);
    } catch (error) {
        console.error('Error handling UML generation:', error.message);
    }
}

async function main() {
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

    // Step 2: Start git flow release
    runCommand(`git flow release start ${version}`);

    // Step 3: Update package.json and package-lock.json
    updatePackageJson(version);
    runCommand('npm i');
    runCommand('git add package.json package-lock.json');
    runCommand(`git commit -m "Bump version to ${version}"`);

    await handleUmlGeneration(version);

    // Step 5: Run tests and build
    runCommand('npm test -- --watch=false --bail');
    runCommand('npm run build');

    // Step 6: Finish release
    const tagMessage = `${version}: ${releaseTitle}`;
    runCommand(`git flow release finish -m "${tagMessage}" ${version}`);

    // Step 7: Push everything
    runCommand('git push origin main');
    runCommand('git push origin develop');
    runCommand('git push --tags');

    console.log(`\n🎉 Successfully released version ${version}: ${releaseTitle}`);
    rl.close();
}

main().catch((error) => {
    console.error('Release failed:', error);
    process.exit(1);
});