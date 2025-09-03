#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void overflowFunction3() {
    char buffer3[15]; // Buffer that can hold 14 characters + null terminator
    printf("Enter a string for buffer 3: ");
    fgets(buffer3, sizeof(buffer3) + 5, stdin); // Intentional overflow in size
    buffer3[strcspn(buffer3, "\n")] = 0; // Remove newline character
    printf("Buffer 3 contents: %s\n", buffer3);
}

void overflowFunction4() {
    char buffer3[15]; // Buffer that can hold 14 characters + null terminator
    printf("Enter a string for buffer 3: ");
    fgets(buffer3, sizeof(buffer3) + 5, stdin); // Intentional overflow in size
    buffer3[strcspn(buffer3, "\n")] = 0; // Remove newline character
    printf("Buffer 3 contents: %s\n", buffer3);
}

int main() {
    // overflowFunction1();
    // overflowFunction2();
    overflowFunction3();
    overflowFunction4();
    return 0;
}