import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const outputDir = 'doc';
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

const topLevelFolders = ['Core', 'Extensions'];
const externalAssociations = new Set(); // Track associations to externalize

topLevelFolders.forEach(folder => {
    const srcFolderPath = path.join('src', folder);
    if (fs.existsSync(srcFolderPath)) {
        fs.readdirSync(srcFolderPath, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .forEach(dirent => {
                const subfolderName = dirent.name;
                const outputFile = path.join(outputDir, `${folder}_${subfolderName}.puml`);

                execSync(`npx tplant --input "${path.join(srcFolderPath, subfolderName)}/*.ts" --output "${outputFile}" --associations`, { stdio: 'inherit' });

                let content = fs.readFileSync(outputFile, 'utf8');

                let currentClass = null; // Variable to store the current class name

                content = content
                    .split('\n')
                    .filter(line => {
                        // Skip association lines (starting with "-")
                        if (/^\s*-/.test(line)) return false;
                        // Skip method lines only (not in class) (starting with "+")
                        if (line.startsWith('+')) return false;

                        if(currentClass !== null) {

                            const classFilePath = path.join(srcFolderPath, subfolderName, `${currentClass}.ts`);
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
                            const classNameMatch = line.match(/class\s+(?:class\s+)?([^\s{]+)/);
                            if (classNameMatch) {
                                const className = classNameMatch[1];
                                currentClass = className.replace(/<.*>/, ''); // Remove generics
                                // Check if the file corresponding to the class exists in the expected subfolder
                                const classFilePath = path.join(srcFolderPath, subfolderName, `${currentClass}.ts`);
                                if (!fs.existsSync(classFilePath)) {
                                    return false; // Skip if the corresponding file doesn't exist
                                }
                            }
                        }
                        return true;
                    }).join('\n');
                fs.writeFileSync(outputFile, content);

                console.log(`Generated PlantUML file for ${folder}/${subfolderName}: ${outputFile}`);
            });
    }
});

const combinedFile = path.join(outputDir, 'combined.puml');
let finalContent = ['@startuml'];

topLevelFolders.forEach(folder => {
    const srcFolderPath = path.join('src', folder);
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
