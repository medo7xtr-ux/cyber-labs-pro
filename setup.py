import os
import json

def create_project_structure():
    """
    Create a React project structure with English names based on the provided Arabic structure
    """
    
    # Project structure with English translations
    structure = {
        "frontend": {
            "src": {
                "components": {
                    "layout": [
                        "NavigationBar.jsx",
                        "Footer.jsx",
                        "Layout.jsx"
                    ],
                    "labs": [
                        "LabCard.jsx",
                        "LabDetails.jsx"
                    ],
                    "common": [
                        "ZD.jsx",  # Keeping ZD as is since it might be an abbreviation
                        "Loader.jsx"
                    ]
                },
                "pages": [
                    "Home.jsx",
                    "Labs.jsx",
                    "Lessons.jsx",
                    "Login.jsx",
                    "Register.jsx",
                    "Dashboard.jsx"
                ],
                "services": [
                    "api.js"
                ],
                "context": [
                    "AuthContext.jsx"
                ],
                "styles": [
                    "theme.js"
                ],
                "assets": {
                    "images": []  # Translated from pic/
                },
                "App.jsx": "",
                "index.jsx": "",
                "App.css": ""
            },
            "package.json": json.dumps({
                "name": "frontend",
                "version": "1.0.0",
                "private": True,
                "dependencies": {
                    "react": "^18.2.0",
                    "react-dom": "^18.2.0"
                },
                "scripts": {
                    "start": "react-scripts start",
                    "build": "react-scripts build",
                    "test": "react-scripts test",
                    "eject": "react-scripts eject"
                }
            }, indent=2)
        }
    }

    def create_dirs_and_files(base_path, structure):
        """
        Recursively create directories and files
        """
        for item, content in structure.items():
            item_path = os.path.join(base_path, item)
            
            if isinstance(content, dict):
                # Create directory and recurse
                os.makedirs(item_path, exist_ok=True)
                create_dirs_and_files(item_path, content)
                
            elif isinstance(content, list):
                # Create directory and files inside it
                if item_path.endswith('.js') or item_path.endswith('.jsx') or item_path.endswith('.css') or item_path.endswith('.json'):
                    # This is actually a file, not a directory with list
                    with open(item_path, 'w', encoding='utf-8') as f:
                        pass  # Create empty file
                else:
                    os.makedirs(item_path, exist_ok=True)
                    for file_name in content:
                        if isinstance(file_name, dict):
                            # Nested directory in list (like assets/images)
                            for sub_dir, sub_files in file_name.items():
                                sub_dir_path = os.path.join(item_path, sub_dir)
                                os.makedirs(sub_dir_path, exist_ok=True)
                                for sub_file in sub_files:
                                    file_path = os.path.join(sub_dir_path, sub_file)
                                    with open(file_path, 'w', encoding='utf-8') as f:
                                        pass
                        else:
                            # Regular file
                            file_path = os.path.join(item_path, file_name)
                            with open(file_path, 'w', encoding='utf-8') as f:
                                # Add basic content for JSX files
                                if file_name.endswith('.jsx'):
                                    component_name = file_name.replace('.jsx', '')
                                    f.write(f"import React from 'react';\n\n")
                                    f.write(f"const {component_name} = () => {{\n")
                                    f.write(f"  return (\n")
                                    f.write(f"    <div>\n")
                                    f.write(f"      <h1>{component_name}</h1>\n")
                                    f.write(f"    </div>\n")
                                    f.write(f"  );\n")
                                    f.write(f"}};\n\n")
                                    f.write(f"export default {component_name};\n")
                                elif file_name == 'api.js':
                                    f.write("// API service functions\n\n")
                                    f.write("const API_BASE_URL = 'http://localhost:3000/api';\n\n")
                                    f.write("export const apiService = {\n")
                                    f.write("  // API methods will be added here\n")
                                    f.write("};\n")
                                elif file_name == 'theme.js':
                                    f.write("// Theme configuration\n\n")
                                    f.write("export const theme = {\n")
                                    f.write("  colors: {\n")
                                    f.write("    primary: '#007bff',\n")
                                    f.write("    secondary: '#6c757d',\n")
                                    f.write("    success: '#28a745',\n")
                                    f.write("  },\n")
                                    f.write("  fonts: {\n")
                                    f.write("    main: 'Arial, sans-serif',\n")
                                    f.write("  }\n")
                                    f.write("};\n")
                                elif file_name == 'AuthContext.jsx':
                                    f.write("import React, { createContext, useState, useContext } from 'react';\n\n")
                                    f.write("const AuthContext = createContext();\n\n")
                                    f.write("export const useAuth = () => useContext(AuthContext);\n\n")
                                    f.write("export const AuthProvider = ({ children }) => {\n")
                                    f.write("  const [user, setUser] = useState(null);\n\n")
                                    f.write("  const login = (userData) => {\n")
                                    f.write("    setUser(userData);\n")
                                    f.write("  };\n\n")
                                    f.write("  const logout = () => {\n")
                                    f.write("    setUser(null);\n")
                                    f.write("  };\n\n")
                                    f.write("  return (\n")
                                    f.write("    <AuthContext.Provider value={{ user, login, logout }}>\n")
                                    f.write("      {children}\n")
                                    f.write("    </AuthContext.Provider>\n")
                                    f.write("  );\n")
                                    f.write("};\n")
                                    
            else:
                # Create file with content
                with open(item_path, 'w', encoding='utf-8') as f:
                    f.write(content)

    # Create the project structure
    print("Creating project structure...")
    create_dirs_and_files('.', structure)
    
    # Create basic React files with content
    print("Creating basic React files...")
    
    # Create App.jsx
    with open('./frontend/src/App.jsx', 'w', encoding='utf-8') as f:
        f.write("""import React from 'react';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Layout />
      </div>
    </AuthProvider>
  );
}

export default App;
""")
    
    # Create index.jsx
    with open('./frontend/src/index.jsx', 'w', encoding='utf-8') as f:
        f.write("""import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './App.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
""")
    
    # Create App.css
    with open('./frontend/src/App.css', 'w', encoding='utf-8') as f:
        f.write("""/* Main App Styles */

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.App {
  min-height: 100vh;
}

code {
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
}
""")
    
    # Create basic Layout.jsx component
    with open('./frontend/src/components/layout/Layout.jsx', 'w', encoding='utf-8') as f:
        f.write("""import React from 'react';
import NavigationBar from './NavigationBar';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <NavigationBar />
      <main className="main-content">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
""")
    
    print("Project structure created successfully!")
    print("\nProject Structure:")
    print("frontend/")
    print("├── src/")
    print("│   ├── components/")
    print("│   │   ├── layout/")
    print("│   │   │   ├── NavigationBar.jsx")
    print("│   │   │   ├── Footer.jsx")
    print("│   │   │   └── Layout.jsx")
    print("│   │   ├── labs/")
    print("│   │   │   ├── LabCard.jsx")
    print("│   │   │   └── LabDetails.jsx")
    print("│   │   └── common/")
    print("│   │       ├── ZD.jsx")
    print("│   │       └── Loader.jsx")
    print("│   ├── pages/")
    print("│   │   ├── Home.jsx")
    print("│   │   ├── Labs.jsx")
    print("│   │   ├── Lessons.jsx")
    print("│   │   ├── Login.jsx")
    print("│   │   ├── Register.jsx")
    print("│   │   └── Dashboard.jsx")
    print("│   ├── services/")
    print("│   │   └── api.js")
    print("│   ├── context/")
    print("│   │   └── AuthContext.jsx")
    print("│   ├── styles/")
    print("│   │   └── theme.js")
    print("│   ├── assets/")
    print("│   │   └── images/")
    print("│   ├── App.jsx")
    print("│   ├── index.jsx")
    print("│   └── App.css")
    print("└── package.json")

if __name__ == "__main__":
    create_project_structure()