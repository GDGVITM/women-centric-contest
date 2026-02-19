# Debugging Competition – Set 3

---

### Problem 1: Prime Number Checker

### Problem Statement:

You are given a positive integer `n = 17`. Write a function to check whether the number is prime. Return 1 if prime, otherwise return 0. Fix the syntax errors and logical mistake.

---

### P1-C:

### Error Containing Code

```c
#include <stdio.h>

int checkPrime() {
    int number = 17;
    int isPrime = 1
    
    if(number <= 1) {
        return 0;
    }

    for(int divisor = 2; divisor < number; divisor++) {
        if(number % divisor = 0) {
            isPrime = 0;
        }
    }

    return isPrime;
}

int main() {
    int result = checkPrime();
    printf("%d\n", result);
    return 0;
}
```

### Corrected Code

```c
#include <stdio.h>

int checkPrime() {
    int number = 17;
    int isPrime = 1;
    
    if(number <= 1) {
        return 0;
    }

    for(int divisor = 2; divisor < number; divisor++) {
        if(number % divisor == 0) {
            isPrime = 0;
            break;
        }
    }

    return isPrime;
}

int main() {
    int result = checkPrime();
    printf("%d\n", result);
    return 0;
}
```

### Generated Output:

```
1
```

---

### P1-Java:

### Error Containing Code

```java
public class Main {
    public static int checkPrime() {
        int number = 17;
        int isPrime = 1

        if(number <= 1) {
            return 0;
        }

        for(int divisor = 2; divisor < number; divisor++) {
            if(number % divisor = 0) {
                isPrime = 0;
            }
        }

        return isPrime;
    }

    public static void main(String[] args) {
        int result = checkPrime()();
        System.out.println(result);
    }
}
```

### Corrected Code

```java
public class Main {
    public static int checkPrime() {
        int number = 17;
        int isPrime = 1;

        if(number <= 1) {
            return 0;
        }

        for(int divisor = 2; divisor < number; divisor++) {
            if(number % divisor == 0) {
                isPrime = 0;
                break;
            }
        }

        return isPrime;
    }

    public static void main(String[] args) {
        int result = checkPrime();
        System.out.println(result);
    }
}
```

### Generated Output:

```
1
```

---

### P1-Python:

### Error Containing Code

```python
def check_prime():
    number = 17
    is_prime = 1
    
    if number <= 1
        return 0
    
    for divisor in range(2, number):
        if number % divisor = 0:
            is_prime = 0
    
    return is_prime

def main():
    result = check_prime()
    print(result)

if __name__ == "__main__":
    main
```

### Corrected Code

```python
def check_prime():
    number = 17
    is_prime = 1
    
    if number <= 1:
        return 0
    
    for divisor in range(2, number):
        if number % divisor == 0:
            is_prime = 0
            break
    
    return is_prime

def main():
    result = check_prime()
    print(result)

if __name__ == "__main__":
    main()
```

### Generated Output:

```
1
```

---

### Problem 2: Array Average Calculator

### Problem Statement:

Given an integer array, calculate the average of all elements as a floating-point value. Fix the syntax and logical errors.

---

### P2-C:

### Error Containing Code

```c
#include <stdio.h>

float calculateAverage() {
    int values[5] = {10, 20, 30, 40, 50};
    int totalSum = 0;
    
    for(int index = 0; index <= 5; index++) {
        totalSum += values[index];
    }
    
    float average = totalSum / 5;
    return average
}

int main() {
    float result = calculateAverage();
    printf("%f\n", result);
    return 0;
}
```

### Corrected Code

```c
#include <stdio.h>

float calculateAverage() {
    int values[5] = {10, 20, 30, 40, 50};
    int totalSum = 0;
    
    for(int index = 0; index < 5; index++) {
        totalSum += values[index];
    }
    
    float average = (float) totalSum / 5;
    return average;
}

int main() {
    float result = calculateAverage();
    printf("%f\n", result);
    return 0;
}
```

### Generated Output:

```
30.000000
```

---

### P2-Java:

### Error Containing Code

```java
public class Main {
    public static float calculateAverage() {
        int[] values = {10, 20, 30, 40, 50};
        int totalSum = 0;

        for(int index = 0; index <= values.length; index++) {
            totalSum += values[index];
        }

        float average = totalSum / 5
        return average;
    }

    public static void main(String[] args) {
        float result = calculateAverage();
        System.out.println(result);
    }
}
```

### Corrected Code

```java
public class Main {
    public static float calculateAverage() {
        int[] values = {10, 20, 30, 40, 50};
        int totalSum = 0;

        for(int index = 0; index < values.length; index++) {
            totalSum += values[index];
        }

        float average = (float) totalSum / values.length;
        return average;
    }

    public static void main(String[] args) {
        float result = calculateAverage();
        System.out.println(result);
    }
}
```

### Generated Output:

```
30.0
```

---

### P2-Python:

### Error Containing Code

```python
def calculate_average():
    values = [10, 20, 30, 40, 50]
    total_sum = 0
    
    for index in range(0, len(values)+1):
        total_sum += values[index]
    
    average = total_sum // 5
    return average

def main():
    result = calculate_average()
    print(result)

if __name__ == "__main__":
    main()
```

### Corrected Code

```python
def calculate_average():
    values = [10, 20, 30, 40, 50]
    total_sum = 0
    
    for index in range(0, len(values)):
        total_sum += values[index]
    
    average = total_sum / len(values)
    return average

def main():
    result = calculate_average()
    print(result)

if __name__ == "__main__":
    main()
```

### Generated Output:

```
30.0
```

---

### Problem 3: Fibonacci Series Generator

### Problem Statement:

Generate the first 7 numbers of the Fibonacci sequence starting from 0 and 1. Fix the syntax and logical errors.

---

### P3-C:

### Error Containing Code

```c
#include <stdio.h>

void generateFibonacci() {
    int first = 0;
    int second = 1;
    int nextValue;
    
    printf("%d %d ", first, second)
    
    for(int counter = 2; counter <= 7; counter++) {
        nextValue = first + second;
        printf("%d ", nextValue);
        first = second;
        second = first;
    }
}

int main() {
    generateFibonacci();
    return 0;
}
```

### Corrected Code

```c
#include <stdio.h>

void generateFibonacci() {
    int first = 0;
    int second = 1;
    int nextValue;
    
    printf("%d %d ", first, second);
    
    for(int counter = 2; counter < 7; counter++) {
        nextValue = first + second;
        printf("%d ", nextValue);
        first = second;
        second = nextValue;
    }
}

int main() {
    generateFibonacci();
    return 0;
}
```

### Generated Output:

```
0 1 1 2 3 5 8 
```

---

### P3-Java:

### Error Containing Code

```java
public class Main {
    public static void generateFibonacci() {
        int first = 0;
        int second = 1;
        int nextValue;

        System.out.print(first + " " + second + " ")

        for(int counter = 2; counter <= 7; counter++) {
            nextValue = first + second;
            System.out.print(nextValue + " ");
            first = second;
            second = first;
        }
    }

    public static void main(String[] args) {
        generateFibonacci();
    }
}
```

### Corrected Code

```java
public class Main {
    public static void generateFibonacci() {
        int first = 0;
        int second = 1;
        int nextValue;

        System.out.print(first + " " + second + " ");

        for(int counter = 2; counter < 7; counter++) {
            nextValue = first + second;
            System.out.print(nextValue + " ");
            first = second;
            second = nextValue;
        }
    }

    public static void main(String[] args) {
        generateFibonacci();
    }
}
```

### Generated Output:

```
0 1 1 2 3 5 8 
```

---

### P3-Python:

### Error Containing Code

```python
def generate_fibonacci():
    first = 0
    second = 1
    
    print(first, second, end=" ")
    
    for counter in range(2, 8):
        next_value = first + second
        print(next_value, end=" ")
        first = second
        second = first

def main():
    generate_fibonacci()

if __name__ == "__main__":
    main()
```

### Corrected Code

```python
def generate_fibonacci():
    first = 0
    second = 1
    
    print(first, second, end=" ")
    
    for counter in range(2, 7):
        next_value = first + second
        print(next_value, end=" ")
        first = second
        second = next_value

def main():
    generate_fibonacci()

if __name__ == "__main__":
    main()
```

### Generated Output:

```
0 1 1 2 3 5 8 
```
