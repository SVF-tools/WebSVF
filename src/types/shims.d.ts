declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

declare module '*.css' {
  const content: string;
  export default content;
}

declare module '*.scss' {
  const content: string;
  export default content;
}

// Allow importing style objects from react-syntax-highlighter style subpaths
declare module 'react-syntax-highlighter/dist/esm/styles/prism' {
  export const vscDarkPlus: unknown;
  export const oneLight: unknown;
  const others: { [key: string]: unknown };
  export default others;
}
