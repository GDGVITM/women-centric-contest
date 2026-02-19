# ## Debugging Competition – Set 1

---

### Problem 1: Even Sum Calculator

##### Problem Statement:

You are given an integer array of size 6. Write a function that calculates the sum of all even numbers in the array. Fix the syntax errors and logical mistake in the implementation.

---

### P1-C:

##### Error Containing Code

```c
#include <stdio.h>

int calculateEvenSum() {
    int numbers[6] = {3, 4, 7, 10, 15, 8};
    int totalSum = 0;
    
    for(int index = 0; index <= 6; index++) {
        if(numbers[index] % 2 = 0) { 
            totalSum += numbers[index]
        }
    }
    
    return totalSum;
}

int main() {
    int result = calculateEvenSum();
    printf("%d\n", result)
    return 0;
}
```

### Corrected Code

```c
#include <stdio.h>

int calculateEvenSum() {
    int numbers[6] = {3, 4, 7, 10, 15, 8};
    int totalSum = 0;
    
    for(int index = 0; index < 6; index++) {
        if(numbers[index] % 2 == 0) {
            totalSum += numbers[index];
        }
    }
    
    return totalSum;
}

int main() {
    int result = calculateEvenSum();
    printf("%d\n", result);
    return 0;
}
```

### Generated Output:

```
22
```

---

### P1-Java:

### Error Containing Code

```java
public class Main {
    public static int calculateEvenSum() {
        int[] numbers = {3, 4, 7, 10, 15, 8};
        int totalSum = 0;

        for(int index = 0; index <= numbers.length; index++) { 
            if(numbers[index] % 2 = 0) { 
                totalSum += numbers[index];
            }
        }

        return totalSum
    }

    public static void main(String[] args) {
        int result = calculateEvenSum();
        System.out.println(result);
    }
}
```

### Corrected Code

```java
public class Main {
    public static int calculateEvenSum() {
        int[] numbers = {3, 4, 7, 10, 15, 8};
        int totalSum = 0;

        for(int index = 0; index < numbers.length; index++) {
            if(numbers[index] % 2 == 0) {
                totalSum += numbers[index];
            }
        }

        return totalSum;
    }

    public static void main(String[] args) {
        int result = calculateEvenSum();
        System.out.println(result);
    }
}
```

### Generated Output:

```
22
```

---

### P1-Python:

### Error Containing Code

```python
def calculate_even_sum():
    numbers = [3, 4, 7, 10, 15, 8]
    total_sum = 0
    
    for index in range(0, len(numbers)+1):  
        if numbers[index] % 2 = 0:  
            total_sum += numbers[index]
    
    return total_sum

def main():
    result = calculate_even_sum()
    print result 

if __name__ == "__main__":
    main
```

### Corrected Code

```python
def calculate_even_sum():
    numbers = [3, 4, 7, 10, 15, 8]
    total_sum = 0
    
    for index in range(0, len(numbers)):
        if numbers[index] % 2 == 0:
            total_sum += numbers[index]
    
    return total_sum

def main():
    result = calculate_even_sum()
    print(result)

if __name__ == "__main__":
    main()
```

### Generated Output:

```
22
```

---

### Problem 2: Reverse Number Generator

### Problem Statement:

Given a positive integer (e.g., 1234), write a function to reverse the digits of the number. Fix the syntax issues and logical error.

---

# ## P2-C:

### Error Containing Code

```c
#include <stdio.h>

int reverseNumber() {
    int number = 1234;
    int reversed = 0
    
    while(number > 0) {
        int digit = number % 10;
        reversed = reversed + digit; 
        number = number / 10
    }
    
    return reversed;
}

int main() {
    int result = reverseNumber();
    printf("%d\n", result);
    return 0;
}
```

### Corrected Code

```c
#include <stdio.h>

int reverseNumber() {
    int number = 1234;
    int reversed = 0;
    
    while(number > 0) {
        int digit = number % 10;
        reversed = reversed * 10 + digit;
        number = number / 10;
    }
    
    return reversed;
}

int main() {
    int result = reverseNumber();
    printf("%d\n", result);
    return 0;
}
```

### Generated Output:

```
4321
```

---

### P2-Java:

### Error Containing Code

```java
public class Main {
    public static int reverseNumber() {
        int number = 1234;
        int reversed = 0;

        while(number > 0) {
            int digit = number % 10;
            reversed = reversed + digit; 
            number = number / 10
        }

        return reversed;
    }

    public static void main(String[] args) {
        int result = reverseNumber();
        system.out.println(result); 
    }
}
```

### Corrected Code

```java
public class Main {
    public static int reverseNumber() {
        int number = 1234;
        int reversed = 0;

        while(number > 0) {
            int digit = number % 10;
            reversed = reversed * 10 + digit;
            number = number / 10;
        }

        return reversed;
    }

    public static void main(String[] args) {
        int result = reverseNumber();
        System.out.println(result);
    }
}
```

### Generated Output:

```
4321
```

---

### P2-Python:

### Error Containing Code

```python
def reverse_number():
    number = 1234
    reversed = 0
    
    while number > 0
        digit = number % 10
        reversed = reversed + digit  
        number = number // 10
    
    return reversed

def main():
    result = reverse_number()
    print(result)

if __name__ == "__main__":
    main()
```

### Corrected Code

```python
def reverse_number():
    number = 1234
    reversed = 0
    
    while number > 0:
        digit = number % 10
        reversed = reversed * 10 + digit
        number = number // 10
    
    return reversed

def main():
    result = reverse_number()
    print(result)

if __name__ == "__main__":
    main()
```

### Generated Output:

```
4321
```

---

### Problem 3: Maximum Element Finder

### Problem Statement:

Given an integer array, find the maximum element in the array. Fix the syntax and logical errors in the code.

---

# ## P3-C:

### Error Containing Code

```c
#include <stdio.h>

int findMaximum() {
    int numbers[5] = {12, 45, 7, 89, 23};
    int maxValue = 0; 
    
    for(int i = 0; i < 5; i++) {
        if(numbers[i] < maxValue) { 
            maxValue = numbers[i]
        }
    }
    
    return maxValue;
}

int main() {
    int result = findMaximum();
    printf("%d\n", result);
    return 0;
}
```

### Corrected Code

```c
#include <stdio.h>

int findMaximum() {
    int numbers[5] = {12, 45, 7, 89, 23};
    int maxValue = numbers[0];
    
    for(int i = 1; i < 5; i++) {
        if(numbers[i] > maxValue) {
            maxValue = numbers[i];
        }
    }
    
    return maxValue;
}

int main() {
    int result = findMaximum();
    printf("%d\n", result);
    return 0;
}
```

### Generated Output:

```
89
```

---

### P3-Java:

### Error Containing Code

```java
public class Main {
    public static int findMaximum() {
        int[] numbers = {12, 45, 7, 89, 23};
        int maxValue = 0;

        for(int i = 0; i < numbers.length; i++) {
            if(numbers[i] < maxValue) {
                maxValue = numbers[i]
            }
        }

        return maxValue;
    }

    public static void main(String[] args) {
        int result = findMaximum();
        System.out.println(result);
    }
}
```

### Corrected Code

```java
public class Main {
    public static int findMaximum() {
        int[] numbers = {12, 45, 7, 89, 23};
        int maxValue = numbers[0];

        for(int i = 1; i < numbers.length; i++) {
            if(numbers[i] > maxValue) {
                maxValue = numbers[i];
            }
        }

        return maxValue;
    }

    public static void main(String[] args) {
        int result = findMaximum();
        System.out.println(result);
    }
}
```

### Generated Output:

```
89
```

---

### P3-Python:

### Error Containing Code

```python
def find_maximum():
    numbers = [12, 45, 7, 89, 23]
    max_value = 0

    for i in range(0, len(numbers)):
        if numbers[i] < max_value  
            max_value = numbers[i]

    return max_value

def main():
    result = find_maximum()
    print(result)

if __name__ == "__main__":
    main()
```

### Corrected Code

```python
def find_maximum():
    numbers = [12, 45, 7, 89, 23]
    max_value = numbers[0]

    for i in range(1, len(numbers)):
        if numbers[i] > max_value:
            max_value = numbers[i]

    return max_value

def main():
    result = find_maximum()
    print(result)

if __name__ == "__main__":
    main()
```

### Generated Output:

```
89
```
