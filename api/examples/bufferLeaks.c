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

typedef struct {
    int *data;
    int size;
} IntArray;

IntArray* createIntArray(int size) {
    IntArray *arr = malloc(sizeof(IntArray)); // Memory leak: no free for arr
    arr->size = size;
    arr->data = malloc(size * sizeof(int)); // Memory leak: no free for arr->data
    for (int i = 0; i < size; i++) {
        arr->data[i] = i; // Initialize the array
    }
    return arr;
}

void useIntArray(IntArray *arr) {
    // Just a placeholder function to simulate use
    for (int i = 0; i < arr->size; i++) {
        printf("%d ", arr->data[i]);
    }
    printf("\n");
}


int main() {
    // overflowFunction1();
    // overflowFunction2();
    overflowFunction3();
    overflowFunction4();

    IntArray *array1 = createIntArray(5);
    IntArray *array2 = createIntArray(10);

    useIntArray(array1);
    useIntArray(array2);
    return 0;
}