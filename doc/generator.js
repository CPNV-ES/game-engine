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

                execSync(`npx tplant --input "${path.join(srcFolderPath, subfolderName)}/**/*.ts" --output "${outputFile}" --associations`, { stdio: 'inherit' });

                let content = fs.readFileSync(outputFile, 'utf8');
                content = content.replace(/@startuml|@enduml/g, '');
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

            let currentClass = null; // Variable to store the current class name

            const filteredContent = fs.readFileSync(path.join(outputDir, file), 'utf8')
                .split('\n')
                .filter(line => {
                    // Skip association lines (starting with "-")
                    if (/^\s*-/.test(line)) return false;
                    // Skip method lines only (not in class) (starting with "+")
                    if (line.startsWith('+')) return false;

                    // Extract association lines (e.g., "ClassA --> ClassB")
                    if (line.includes('-->')) {
                        externalAssociations.add(line.trim()); // Add to external associations
                        return false;
                    }

                    if(currentClass !== null) {

                        const classFilePath = path.join(srcFolderPath, subfolderName, `${currentClass}.ts`);
                        // If we're inside a class, skip lines until the closing brace "}"
                        if (line.trim().startsWith('}')) {
                            currentClass = null; // Reset the current class when closing brace is encountered
                        }
                        console.log(classFilePath)
                        if (!fs.existsSync(classFilePath)) {
                            console.log("DON'T EXIST");
                            return false; // Skip if the corresponding file doesn't exist
                        }else {
                            console.log("EXIST");
                        }
                    }

                    // Detect and handle class definitions to avoid duplicates
                    if (line.trim().startsWith('class ')) {
                        const classNameMatch = line.match(/class\s+(?:class\s+)?([^\s{]+)/);
                        if (classNameMatch) {
                            const className = classNameMatch[1];
                            currentClass = className.replace(/<.*>/, ''); // Remove generics
                            // Check if the file corresponding to the class exists in the expected subfolder
                            const classFilePath = path.join(srcFolderPath, subfolderName, `${currentClass}.ts`);
                            console.log(classFilePath)
                            if (!fs.existsSync(classFilePath)) {
                                console.log("DON'T EXIST");
                                return false; // Skip if the corresponding file doesn't exist
                            }else {
                                console.log("EXIST");
                            }
                        }
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

// Cleanup intermediate files
topLevelFolders.forEach(folder => {
    fs.readdirSync(outputDir)
        .filter(file => file.startsWith(`${folder}_`) && file.endsWith('.puml'))
        .forEach(file => fs.unlinkSync(path.join(outputDir, file)));
});
console.log('Cleaned up intermediate PlantUML files.');