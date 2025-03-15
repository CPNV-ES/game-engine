import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const outputDir = 'doc';
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

const topLevelFolders = ['Core', 'Extensions'];
const externalAssociations = new Set(); // Track associations to externalize

// Function to sanitize folder names for consistent output
const sanitizeFolderName = (folderPath, baseFolder) => {
    const relativePath = path.relative(path.join('src', baseFolder), folderPath);
    return relativePath ? `${baseFolder}_${relativePath.replace(/[\/\\]/g, '_')}` : baseFolder;
};

// Function to process a directory only once per folder
const processDirectory = (dirPath, folderName, subfolderName) => {
    const outputFile = path.join(outputDir, `${subfolderName}.puml`);

    // Ensure the directory contains TypeScript files before running `tplant`
    const tsFiles = fs.readdirSync(dirPath).filter(file => file.endsWith('.ts'));
    if (tsFiles.length === 0) return; // Skip empty folders

    execSync(`npx tplant --input "${dirPath}/*.ts" --output "${outputFile}" --associations`, { stdio: 'inherit' });

    let content = fs.readFileSync(outputFile, 'utf8');
    content = content
        .split('\n')
        .filter(line => {
            if (/^\s*-/.test(line)) return false; // Skip association lines
            if (line.startsWith('+')) return false; // Skip method lines not in class
            return true;
        })
        .join('\n');

    fs.writeFileSync(outputFile, content);
    console.log(`Generated PlantUML file for ${folderName}/${subfolderName}: ${outputFile}`);
};

// Recursive function to process all `.ts` files in directories
const recursiveProcess = (srcFolderPath, folderName) => {
    let hasTsFiles = false;

    fs.readdirSync(srcFolderPath, { withFileTypes: true }).forEach(dirent => {
        const fullPath = path.join(srcFolderPath, dirent.name);
        if (dirent.isDirectory()) {
            recursiveProcess(fullPath, folderName);
        } else if (dirent.name.endsWith('.ts')) {
            hasTsFiles = true;
        }
    });

    if (hasTsFiles) {
        const subfolder = sanitizeFolderName(srcFolderPath, folderName);
        processDirectory(srcFolderPath, folderName, subfolder);
    }
};

topLevelFolders.forEach(folder => {
    const srcFolderPath = path.join('src', folder);
    if (fs.existsSync(srcFolderPath)) {
        recursiveProcess(srcFolderPath, folder);
    }
});

// Combine UML files
const combinedFile = path.join(outputDir, 'combined.puml');
let finalContent = ['@startuml'];

topLevelFolders.forEach(folder => {
    finalContent.push(`package ${folder} {`);

    fs.readdirSync(outputDir)
        .filter(file => file.startsWith(`${folder}_`) && file.endsWith('.puml'))
        .forEach(file => {
            const subfolderName = file.replace('.puml', '');
            finalContent.push(`    package ${subfolderName.replace(`${folder}_`, '')} {`);

            const filteredContent = fs.readFileSync(path.join(outputDir, file), 'utf8')
                .replace(/@startuml|@enduml/g, '')
                .split('\n')
                .filter(line => {
                    if (line.includes('-->')) {
                        externalAssociations.add(line.trim());
                        return false;
                    }
                    return true;
                });

            finalContent.push(...filteredContent, '    }');
        });

    finalContent.push('}');
});

finalContent.push(...Array.from(externalAssociations));
finalContent.push('@enduml');
fs.writeFileSync(combinedFile, finalContent.join('\n'));
console.log(`Combined PlantUML file saved to ${combinedFile}`);
