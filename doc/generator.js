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
    return path.relative(path.join('src', baseFolder), folderPath).replace(/[\\/]/g, '_');
};

// Recursive function to traverse directories
const processDirectory = (dirPath, folderName, subfolderName) => {
    const outputFile = path.join(outputDir, `${folderName}_${subfolderName}.puml`);
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
    fs.readdirSync(srcFolderPath, { withFileTypes: true })
        .forEach(dirent => {
            const fullPath = path.join(srcFolderPath, dirent.name);
            if (dirent.isDirectory()) {
                recursiveProcess(fullPath, folderName);
            } else if (dirent.name.endsWith('.ts')) {
                const subfolder = sanitizeFolderName(path.dirname(fullPath), folderName);
                processDirectory(path.dirname(fullPath), folderName, subfolder);
            }
        });
};

topLevelFolders.forEach(folder => {
    const srcFolderPath = path.join('src', folder);
    if (fs.existsSync(srcFolderPath)) {
        recursiveProcess(srcFolderPath, folder);
    }
});

const combinedFile = path.join(outputDir, 'combined.puml');
let finalContent = ['@startuml'];

topLevelFolders.forEach(folder => {
    finalContent.push(`package ${folder} {`);

    fs.readdirSync(outputDir)
        .filter(file => file.startsWith(`${folder}_`) && file.endsWith('.puml'))
        .forEach(file => {
            const subfolderName = file.replace(`${folder}_`, '').replace('.puml', '');
            finalContent.push(`    package ${subfolderName} {`);

            const filteredContent = fs.readFileSync(path.join(outputDir, file), 'utf8')
                .replace(/@startuml|@enduml/g, '')
                .split('\n')
                .filter(line => {
                    // Extract association lines (e.g., "ClassA --> ClassB")
                    if (line.includes('-->')) {
                        /*if(line.includes("--> \"1\" Event")) return false;
                        if(line.includes("--> \"1\" GameObject")) return false;
                        if(line.includes("--> \"1\" Vector2")) return false;
                        if(line.includes("--> \"1\" Vector3")) return false;*/

                        externalAssociations.add(line.trim()); // Add to external associations
                        return false;
                    }

                    return true; // Keep method lines ("+") and other valid content
                });

            finalContent.push(...filteredContent, '    }');
        });

    finalContent.push('}');
});

finalContent.push(...Array.from(externalAssociations));
finalContent.push('@enduml');
fs.writeFileSync(combinedFile, finalContent.join('\n'));
console.log(`Combined PlantUML file saved to ${combinedFile}`);