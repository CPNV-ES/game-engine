import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const outputDir = 'doc/diagrams';
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
    let currentClass = null; // Variable to store the current class name
    let validClassesSet = new Set(); // Set to store valid classes

    content = content
        .split('\n')
        .filter(line => {
            if (/^\s*-/.test(line)) return false; // Skip association lines
            if (line.startsWith('+')) return false; // Skip method lines not in class
            if(line.includes('+{static}')) return false; // Skip static methods
            if(line.includes('--> "1"')){
                // We can keep the association only if it's related to a valid class
                for(let className of validClassesSet){
                    if(line.includes(className)){
                        return true;
                    }
                }
                return false;
            }

            if(currentClass !== null) {
                const classFilePath = path.join(dirPath, `${currentClass}.ts`);
                // If we're inside a class, skip lines until the closing brace "}"
                if (line.trim().startsWith('}')) {
                    currentClass = null; // Reset the current class when closing brace is encountered
                }
                if (!fs.existsSync(classFilePath)) {
                    return false; // Skip if the corresponding file doesn't exist
                }
            }

            // Detect and handle class definitions to avoid duplicates
            if (line.trim().startsWith('class ') || line.trim().startsWith('abstract class ') || line.trim().startsWith('interface ')) {
                const classNameMatch = line.match(/(?:class|interface)\s+(?:class|interface\s+)?([^\s{]+)/);
                if (classNameMatch) {
                    const className = classNameMatch[1];
                    currentClass = className.replace(/<.*>/, ''); // Remove generics
                    // Check if the file corresponding to the class exists in the expected subfolder
                    const classFilePath = path.join(dirPath, `${currentClass}.ts`);
                    if (!fs.existsSync(classFilePath)) {
                        return false; // Skip if the corresponding file doesn't exist
                    }else{
                        validClassesSet.add(classNameMatch[1]);
                    }
                }
            }
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
let finalContent = ['@startuml'];

topLevelFolders.forEach(folder => {
    finalContent.push(`package ${folder} {`);

    fs.readdirSync(outputDir)
        .filter(file => file.startsWith(`${folder}`) && file.endsWith('.puml'))
        .forEach(file => {
            const subfolderName = file.replace('.puml', '');
            const packageName = subfolderName.replace(`${folder}_`, '').replace(`_`, '.');

            if(packageName !== "" && packageName !== folder){
                finalContent.push(`    package ${packageName} {`);
            }

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

            finalContent.push(...filteredContent);
            if(packageName !== "" && packageName !== folder) {
                finalContent.push('    }');
            }
        });

    finalContent.push('}');
});

finalContent.push(...Array.from(externalAssociations));
finalContent.push('@enduml');

const combinedFile = path.join(outputDir, 'Combined.puml');
fs.writeFileSync(combinedFile, finalContent.join('\n'));
console.log(`Combined PlantUML file saved to ${combinedFile}`);

// Generate a condensed version of the combined file
const condensedFile = path.join(outputDir, 'Condensed.puml');
const condensedContent = finalContent
    .filter(line => !line.trim().startsWith('+') && !line.trim().startsWith('#') && !line.includes('--> "1"'))
    .join('\n');
fs.writeFileSync(condensedFile, condensedContent);
console.log(`Condensed PlantUML file saved to ${condensedFile}`);