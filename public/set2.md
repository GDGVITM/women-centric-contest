# ## Debugging Competition – Set 2

---

### Problem 1: Factorial Finder

### Problem Statement:

You are given a positive integer `n = 5`. Write a function to compute the factorial of the number. Fix the syntax errors and logical mistake in the implementation.

---

### P1-C:

### Error Containing Code

```c
#include <stdio.h>

int calculateFactorial() {
    int number = 5;
    int factorial = 0;
    
    for(int counter = 1; counter <= number; counter++) {
        factorial = factorial * counter
    }
    
    return factorial;
}

int main() {
    int result = calculateFactorial()();
    printf("%d\n", result);
    return 0
}
```

### Corrected Code

```c
#include <stdio.h>

int calculateFactorial() {
    int number = 5;
    int factorial = 1;
    
    for(int counter = 1; counter <= number; counter++) {
        factorial = factorial * counter;
    }
    
    return factorial;
}

int main() {
    int result = calculateFactorial();
    printf("%d\n", result);
    return 0;
}
```

### Generated Output:

```
120
```

---

# ## P1-Java:

### Error Containing Code

```java
public class Main {
    public static int calculateFactorial() {
        int number = 5;
        int factorial = 0;

        for(int counter = 1; counter <= number; counter++) {
            factorial = factorial * counter
        }

        return factorial;
    }

    public static void main(String[] args) {
        int result = calculateFactorial()();
        system.out.println(result);
    }
}
```

### Corrected Code

```java
public class Main {
    public static int calculateFactorial() {
        int number = 5;
        int factorial = 1;

        for(int counter = 1; counter <= number; counter++) {
            factorial = factorial * counter;
        }

        return factorial;
    }

    public static void main(String[] args) {
        int result = calculateFactorial();
        System.out.println(result);
    }
}
```

### Generated Output:

```
120
```

---

### P1-Python:

### Error Containing Code

```python
def calculate_factorial():
    number = 5
    factorial = 0
    
    for counter in range(1, number+1)
        factorial = factorial * counter
    
    return factorial

def main():
    result = calculate_factorial()
    print result

if __name__ == "__main__":
    main
```

### Corrected Code

```python
def calculate_factorial():
    number = 5
    factorial = 1
    
    for counter in range(1, number+1):
        factorial = factorial * counter
    
    return factorial

def main():
    result = calculate_factorial()
    print(result)

if __name__ == "__main__":
    main()
```

### Generated Output:

```
120
```

---

### Problem 2: Count Positive Numbers

### Problem Statement:

Given an integer array, count how many numbers are strictly positive. Fix the syntax and logical errors.

---

### P2-C:

### Error Containing Code

```c
#include <stdio.h>

int countPositiveNumbers() {
    int values[7] = {-3, 5, 0, 12, -8, 7, 4};
    int positiveCount = 0;
    
    for(int index = 0; index <= 7; index++) {
        if(values[index] >= 0) {
            positiveCount =+ 1;
        }
    }
    
    return positiveCount
}

int main() {
    int result = countPositiveNumbers();
    printf("%d\n", result);
    return 0;
}
```

### Corrected Code

```c
#include <stdio.h>

int countPositiveNumbers() {
    int values[7] = {-3, 5, 0, 12, -8, 7, 4};
    int positiveCount = 0;
    
    for(int index = 0; index < 7; index++) {
        if(values[index] > 0) {
            positiveCount += 1;
        }
    }
    
    return positiveCount;
}

int main() {
    int result = countPositiveNumbers();
    printf("%d\n", result);
    return 0;
}
```

### Generated Output:

```
4
```

---

### P2-Java:

### Error Containing Code

```java
public class Main {
    public static int countPositiveNumbers() {
        int[] values = {-3, 5, 0, 12, -8, 7, 4};
        int positiveCount = 0;

        for(int index = 0; index <= values.length; index++) {
            if(values[index] >= 0) {
                positiveCount =+ 1;
            }
        }

        return positiveCount
    }

    public static void main(String[] args) {
        int result = countPositiveNumbers();
        System.out.println(result);
    }
}
```

### Corrected Code

```java
public class Main {
    public static int countPositiveNumbers() {
        int[] values = {-3, 5, 0, 12, -8, 7, 4};
        int positiveCount = 0;

        for(int index = 0; index < values.length; index++) {
            if(values[index] > 0) {
                positiveCount += 1;
            }
        }

        return positiveCount;
    }

    public static void main(String[] args) {
        int result = countPositiveNumbers();
        System.out.println(result);
    }
}
```

### Generated Output:

```
4
```

---

### P2-Python:

### Error Containing Code

```python
def count_positive_numbers():
    values = [-3, 5, 0, 12, -8, 7, 4]
    positive_count = 0
    
    for index in range(0, len(values)+1):
        if values[index] >= 0:
            positive_count =+ 1
    
    return positive_count

def main():
    result = count_positive_numbers()
    print(result)

if __name__ == "__main__":
    Main()
```

### Corrected Code

```python
def count_positive_numbers():
    values = [-3, 5, 0, 12, -8, 7, 4]
    positive_count = 0
    
    for index in range(0, len(values)):
        if values[index] > 0:
            positive_count += 1
    
    return positive_count

def main():
    result = count_positive_numbers()
    print(result)

if __name__ == "__main__":
    main()
```

### Generated Output:

```
4
```

---

### Problem 3: Palindrome Number Checker

### Problem Statement:

Given a positive integer, check whether it is a palindrome number. Return 1 if it is a palindrome, otherwise return 0. Fix the syntax and logical errors.

---

### P3-C:

### Error Containing Code

```c
#include <stdio.h>

int checkPalindrome() {
    int number = 121;
    int original = number;
    int reversed = 0
    
    while(number > 0) {
        int digit = number % 10;
        reversed = reversed + digit;
        number = number / 10;
    }
    
    if(original = reversed) {
        return 1;
    } else {
        return 0;
    }
}

int main() {
    int result = checkPalindrome();
    printf("%d\n", result);
    return 0;
}
```

### Corrected Code

```c
#include <stdio.h>

int checkPalindrome() {
    int number = 121;
    int original = number;
    int reversed = 0;
    
    while(number > 0) {
        int digit = number % 10;
        reversed = reversed * 10 + digit;
        number = number / 10;
    }
    
    if(original == reversed) {
        return 1;
    } else {
        return 0;
    }
}

int main() {
    int result = checkPalindrome();
    printf("%d\n", result);
    return 0;
}
```

### Generated Output:

```
1
```

---

### P3-Java:

### Error Containing Code

```java
public class Main {
    public static int checkPalindrome() {
        int number = 121;
        int original = number;
        int reversed = 0;

        while(number > 0) {
            int digit = number % 10;
            reversed = reversed + digit;
            number = number / 10
        }

        if(original = reversed) {
            return 1;
        } else {
            return 0;
        }
    }

    public static void main(String[] args) {
        int result = checkPalindrome();
        System.out.println(result);
    }
}
```

### Corrected Code

```java
public class Main {
    public static int checkPalindrome() {
        int number = 121;
        int original = number;
        int reversed = 0;

        while(number > 0) {
            int digit = number % 10;
            reversed = reversed * 10 + digit;
            number = number / 10;
        }

        if(original == reversed) {
            return 1;
        } else {
            return 0;
        }
    }

    public static void main(String[] args) {
        int result = checkPalindrome();
        System.out.println(result);
    }
}
```

### Generated Output:

```
1
```

---

### P3-Python:

### Error Containing Code

```python
def check_palindrome():
    number = 121
    original = number
    reversed = 0
    
    while number > 0:
        digit = number % 10
        reversed = reversed + digit
        number = number // 10
    
    if original = reversed:
        return 1
    else:
        return 0

def main():
    result = check_palindrome()
    print(result)

if __name__ == "__main__":
    main()
```

### Corrected Code

```python
def check_palindrome():
    number = 121
    original = number
    reversed = 0
    
    while number > 0:
        digit = number % 10
        reversed = reversed * 10 + digit
        number = number // 10
    
    if original == reversed:
        return 1
    else:
        return 0

def main():
    result = check_palindrome()
    print(result)

if __name__ == "__main__":
    main()
```

### Generated Output:

```
1
```
