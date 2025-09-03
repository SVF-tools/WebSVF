#include <stdio.h>
#include <stdlib.h>

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
    IntArray *array1 = createIntArray(5);
    IntArray *array2 = createIntArray(10);

    useIntArray(array1);
    useIntArray(array2);

    // Memory leaks: no free for array1 and array2

    return 0;
}