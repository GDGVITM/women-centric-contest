### Debugging Competition – Set 3 (Single Integer Output Only)

---

### Problem 1: Count Divisors

### Problem Statement:

You are given a positive integer `n = 12`. Write a function to count the total number of divisors of the number. Fix the syntax errors and logical mistake.

---

### P1-C:

### Error Containing Code

```c
#include <stdio.h>

int countDivisors() {
    int number = 12;
    int divisorCount = 0
    
    for(int divisor = 1; divisor < number; divisor++) {
        if(number % divisor = 0) {
            divisorCount =+ 1;
        }
    }
    
    return divisorCount;
}

int main() {
    int result = countDivisors()();
    printf("%d\n", result);
    return 0;
}
```

### Corrected Code

```c
#include <stdio.h>

int countDivisors() {
    int number = 12;
    int divisorCount = 0;
    
    for(int divisor = 1; divisor <= number; divisor++) {
        if(number % divisor == 0) {
            divisorCount += 1;
        }
    }
    
    return divisorCount;
}

int main() {
    int result = countDivisors();
    printf("%d\n", result);
    return 0;
}
```

### Generated Output:

```
6
```

---

### P1-Java:

### Error Containing Code

```java
public class Main {
    public static int countDivisors() {
        int number = 12;
        int divisorCount = 0

        for(int divisor = 1; divisor < number; divisor++) {
            if(number % divisor = 0) {
                divisorCount =+ 1;
            }
        }

        return divisorCount;
    }

    public static void main(String[] args) {
        int result = countDivisors()();
        System.out.println(result);
    }
}
```

### Corrected Code

```java
public class Main {
    public static int countDivisors() {
        int number = 12;
        int divisorCount = 0;

        for(int divisor = 1; divisor <= number; divisor++) {
            if(number % divisor == 0) {
                divisorCount += 1;
            }
        }

        return divisorCount;
    }

    public static void main(String[] args) {
        int result = countDivisors();
        System.out.println(result);
    }
}
```

### Generated Output:

```
6
```

---

### P1-Python:

### Error Containing Code

```python
def count_divisors():
    number = 12
    divisor_count = 0
    
    for divisor in range(1, number):
        if number % divisor = 0:
            divisor_count =+ 1
    
    return divisor_count

def main():
    result = count_divisors()
    print(result)

if __name__ == "__main__":
    main
```

### Corrected Code

```python
def count_divisors():
    number = 12
    divisor_count = 0
    
    for divisor in range(1, number+1):
        if number % divisor == 0:
            divisor_count += 1
    
    return divisor_count

def main():
    result = count_divisors()
    print(result)

if __name__ == "__main__":
    main()
```

### Generated Output:

```
6
```

---

### Problem 2: Sum of Digits

### Problem Statement:

Given a positive integer `n = 582`, compute the sum of its digits. Fix the syntax and logical errors.

---

### P2-C:

### Error Containing Code

```c
#include <stdio.h>

int sumOfDigits() {
    int number = 582;
    int sum = 0
    
    while(number > 0) {
        int digit = number % 10;
        sum = sum * digit;
        number = number / 10
    }
    
    return sum;
}

int main() {
    int result = sumOfDigits();
    printf("%d\n", result);
    return 0;
}
```

### Corrected Code

```c
#include <stdio.h>

int sumOfDigits() {
    int number = 582;
    int sum = 0;
    
    while(number > 0) {
        int digit = number % 10;
        sum = sum + digit;
        number = number / 10;
    }
    
    return sum;
}

int main() {
    int result = sumOfDigits();
    printf("%d\n", result);
    return 0;
}
```

### Generated Output:

```
15
```

---

### P2-Java:

### Error Containing Code

```java
public class Main {
    public static int sumOfDigits() {
        int number = 582;
        int sum = 0;

        while(number > 0) {
            int digit = number % 10;
            sum = sum * digit;
            number = number / 10
        }

        return sum;
    }

    public static void main(String[] args) {
        int result = sumOfDigits();
        System.out.println(result);
    }
}
```

### Corrected Code

```java
public class Main {
    public static int sumOfDigits() {
        int number = 582;
        int sum = 0;

        while(number > 0) {
            int digit = number % 10;
            sum = sum + digit;
            number = number / 10;
        }

        return sum;
    }

    public static void main(String[] args) {
        int result = sumOfDigits();
        System.out.println(result);
    }
}
```

### Generated Output:

```
15
```

---

### P2-Python:

### Error Containing Code

```python
def sum_of_digits():
    number = 582
    total = 0
    
    while number > 0
        digit = number % 10
        total = total * digit
        number = number // 10
    
    return total

def main():
    result = sum_of_digits()
    print(result)

if __name__ == "__main__":
    main()
```

### Corrected Code

```python
def sum_of_digits():
    number = 582
    total = 0
    
    while number > 0:
        digit = number % 10
        total = total + digit
        number = number // 10
    
    return total

def main():
    result = sum_of_digits()
    print(result)

if __name__ == "__main__":
    main()
```

### Generated Output:

```
15
```

---

### Problem 3: Count Even Digits

### Problem Statement:

Given a positive integer `n = 24681`, count how many even digits it contains. Fix the syntax and logical errors.

---

### P3-C:

### Error Containing Code

```c
#include <stdio.h>

int countEvenDigits() {
    int number = 24681;
    int evenCount = 0
    
    while(number > 0) {
        int digit = number % 10;
        if(digit % 2 = 0) {
            evenCount =+ 1;
        }
        number = number / 10;
    }
    
    return evenCount;
}

int main() {
    int result = countEvenDigits();
    printf("%d\n", result);
    return 0;
}
```

### Corrected Code

```c
#include <stdio.h>

int countEvenDigits() {
    int number = 24681;
    int evenCount = 0;
    
    while(number > 0) {
        int digit = number % 10;
        if(digit % 2 == 0) {
            evenCount += 1;
        }
        number = number / 10;
    }
    
    return evenCount;
}

int main() {
    int result = countEvenDigits();
    printf("%d\n", result);
    return 0;
}
```

### Generated Output:

```
3
```

---

### P3-Java:

### Error Containing Code

```java
public class Main {
    public static int countEvenDigits() {
        int number = 24681;
        int evenCount = 0

        while(number > 0) {
            int digit = number % 10;
            if(digit % 2 = 0) {
                evenCount =+ 1;
            }
            number = number / 10;
        }

        return evenCount;
    }

    public static void main(String[] args) {
        int result = countEvenDigits();
        System.out.println(result);
    }
}
```

### Corrected Code

```java
public class Main {
    public static int countEvenDigits() {
        int number = 24681;
        int evenCount = 0;

        while(number > 0) {
            int digit = number % 10;
            if(digit % 2 == 0) {
                evenCount += 1;
            }
            number = number / 10;
        }

        return evenCount;
    }

    public static void main(String[] args) {
        int result = countEvenDigits();
        System.out.println(result);
    }
}
```

### Generated Output:

```
3
```

---

### P3-Python:

### Error Containing Code

```python
def count_even_digits():
    number = 24681
    even_count = 0
    
    while number > 0:
        digit = number % 10
        if digit % 2 = 0:
            even_count =+ 1
        number = number // 10
    
    return even_count

def main():
    result = count_even_digits()
    print(result)

if __name__ == "__main__":
    main
```

### Corrected Code

```python
def count_even_digits():
    number = 24681
    even_count = 0
    
    while number > 0:
        digit = number % 10
        if digit % 2 == 0:
            even_count += 1
        number = number // 10
    
    return even_count

def main():
    result = count_even_digits()
    print(result)

if __name__ == "__main__":
    main()
```

### Generated Output:

```
3
```
