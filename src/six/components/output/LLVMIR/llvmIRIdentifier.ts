const highlightColours = [
  '#D9F0E9',
  '#FFFFE3',
  '#E9E8F1',
  '#FFD6D2',
  '#D4E5EE',
  '#D5E4EF',
  '#FFE5C9',
  '#E5F4CD',
  '#F2F2F0',
  '#E9D6E7',
  '#EDF8EA',
  '#FFF8CF',
];

interface lineNumDetails {
  [codeLineNum: string]: {
    nodeOrllvm: string[];
    colour: string;
  };
}

export const llvmHighlight = (codeByLine: string[], llvmIRByLine: string[]) => {
  let llvmIndex = 0;
  const highlightDetails: lineNumDetails = {};
  let highlightColourIndex = 0;

  for (let i = 0; i < codeByLine.length; i++) {
    const codeLine: string = codeByLine[i];
    // Checks if the line is a return statement
    // Looks for a return with a space after it
    if (codeLine.match(/return\s+\w+;/)) {
      llvmIndex = findReturn(codeByLine, llvmIRByLine, i, llvmIndex);
      highlightDetails[i + 1] = {
        nodeOrllvm: [llvmIndex.toString()],
        colour: highlightColours[highlightColourIndex % highlightColours.length],
      };
      highlightColourIndex++;
    }
  }
  return highlightDetails;
};

const findReturn = (
  _codeByLine: string[],
  llvmIRByLine: string[],
  _codeIndex: number,
  llvmIndex: number
) => {
  // Look for return statements in llvm
  // return statement regex is space after ret then space
  for (let i = llvmIndex; i < llvmIRByLine.length; i++) {
    const llvmLine: string = llvmIRByLine[i];
    if (llvmLine.match(/^\s+ret\s+/)) {
      return i + 1;
    }
  }
  return llvmIndex;
};
