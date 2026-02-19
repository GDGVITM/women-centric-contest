import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Placeholder buggy snippets — replace with actual competition code before event
const snippetsBySet: Record<string, Record<number, Record<string, string>>> = {
    A: {
        1: {
            c: `#include <stdio.h>

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
    printf("%d\\n", result)
    return 0;
}`,
            java: `public class Main {
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
}`,
            python: `def calculate_even_sum():
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
    main`
        },
        2: {
            c: `#include <stdio.h>

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
    printf("%d\\n", result);
    return 0;
}`,
            java: `public class Main {
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
}`,
            python: `def reverse_number():
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
    main()`
        },
        3: {
            c: `#include <stdio.h>

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
    printf("%d\\n", result);
    return 0;
}`,
            java: `public class Main {
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
}`,
            python: `def find_maximum():
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
    main()`
        }
    },
    B: {
        1: {
            c: `#include <stdio.h>

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
    printf("%d\\n", result);
    return 0
}`,
            java: `public class Main {
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
}`,
            python: `def calculate_factorial():
    number = 5
    factorial = 0
    
    for counter in range(1, number+1)
        factorial = factorial * counter
    
    return factorial

def main():
    result = calculate_factorial()
    print result

if __name__ == "__main__":
    main`
        },
        2: {
            c: `#include <stdio.h>

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
    printf("%d\\n", result);
    return 0;
}`,
            java: `public class Main {
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
}`,
            python: `def count_positive_numbers():
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
    Main()`
        },
        3: {
            c: `#include <stdio.h>

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
    printf("%d\\n", result);
    return 0;
}`,
            java: `public class Main {
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
}`,
            python: `def check_palindrome():
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
    main()`
        }
    },
    C: {
        1: {
            c: `#include <stdio.h>

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
    printf("%d\\n", result);
    return 0;
}`,
            java: `public class Main {
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
}`,
            python: `def check_prime():
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
    main`
        },
        2: {
            c: `#include <stdio.h>

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
    printf("%f\\n", result);
    return 0;
}`,
            java: `public class Main {
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
}`,
            python: `def calculate_average():
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
    main()`
        },
        3: {
            c: `#include <stdio.h>

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
}`,
            java: `public class Main {
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
}`,
            python: `def generate_fibonacci():
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
    main()`
        }
    },
    D: {
        1: {
            c: `#include <stdio.h>

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
    printf("%d\\n", result);
    return 0;
}`,
            java: `public class Main {
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
}`,
            python: `def count_divisors():
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
    main`
        },
        2: {
            c: `#include <stdio.h>

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
    printf("%d\\n", result);
    return 0;
}`,
            java: `public class Main {
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
}`,
            python: `def sum_of_digits():
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
    main()`
        },
        3: {
            c: `#include <stdio.h>

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
    printf("%d\\n", result);
    return 0;
}`,
            java: `public class Main {
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
}`,
            python: `def count_even_digits():
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
    main`
        }
    }
};

const unlockKeys: Record<string, string> = {
    A: '482917',
    B: '735261',
    C: '194826',
    D: '653748'
};

// Description for each snippet (same across all 3 languages for a given set + member)
const snippetDescriptions: Record<string, Record<number, string>> = {
    A: {
        1: '📌 You are given an integer array of size 6. Write a function that calculates the sum of all even numbers in the array. Fix the syntax errors and logical mistake.',
        2: '📌 Given a positive integer 1234, write a function to reverse the digits of the number. Fix the syntax issues and logical error.',
        3: '📌 Given an integer array, find the maximum element in the array. Fix the syntax and logical errors in the code.'
    },
    B: {
        1: '📌 You are given a positive integer n = 5. Write a function to compute the factorial of the number. Fix the syntax errors and logical mistake.',
        2: '📌 Given an integer array, count how many numbers are strictly positive. Fix the syntax and logical errors.',
        3: '📌 Given a positive integer 121, check whether it is a palindrome number. Return 1 if palindrome, 0 otherwise. Fix the syntax and logical errors.'
    },
    C: {
        1: '📌 You are given a positive integer n = 17. Write a function to check whether the number is prime. Return 1 if prime, 0 otherwise. Fix the syntax errors and logical mistake.',
        2: '📌 Given an integer array, calculate the average of all elements as a floating-point value. Fix the syntax and logical errors.',
        3: '📌 Generate the first 7 numbers of the Fibonacci sequence starting from 0 and 1. Fix the syntax and logical errors.'
    },
    D: {
        1: '📌 You are given a positive integer n = 12. Write a function to count the total number of divisors. Fix the syntax errors and logical mistake.',
        2: '📌 Given a positive integer n = 582, compute the sum of its digits. Fix the syntax and logical errors.',
        3: '📌 Given a positive integer n = 24681, count how many even digits it contains. Fix the syntax and logical errors.'
    }
};

async function main() {
    // Clear existing data
    await prisma.round2Submission.deleteMany();
    await prisma.keyAttempt.deleteMany();
    await prisma.member.deleteMany();
    await prisma.team.deleteMany();
    await prisma.snippet.deleteMany();
    await prisma.set.deleteMany();

    // Create sets
    const sets: Record<string, { id: number }> = {};
    for (const setName of ['A', 'B', 'C', 'D']) {
        sets[setName] = await prisma.set.create({
            data: {
                name: setName,
                unlockKey: unlockKeys[setName]
            }
        });
    }

    // Create snippets
    for (const [setName, members] of Object.entries(snippetsBySet)) {
        for (const [memberNoStr, languages] of Object.entries(members)) {
            const memberNo = parseInt(memberNoStr);
            const description = snippetDescriptions[setName]?.[memberNo] || '';
            for (const [language, code] of Object.entries(languages)) {
                await prisma.snippet.create({
                    data: {
                        setId: sets[setName].id,
                        memberNo,
                        language,
                        description,
                        code
                    }
                });
            }
        }
    }

    // Create 20 teams (T01-T20) with round-robin set assignment
    const setNames = ['A', 'B', 'C', 'D'];
    for (let i = 1; i <= 20; i++) {
        const teamCode = `T${i.toString().padStart(2, '0')}`;
        const assignedSet = setNames[(i - 1) % 4];
        const team = await prisma.team.create({
            data: {
                teamCode,
                setId: sets[assignedSet].id,
                status: 'waiting'
            }
        });

        // Create 3 member slots per team
        // Each member gets a 2-digit fragment of the unlock key
        const key = unlockKeys[assignedSet];
        for (let m = 1; m <= 3; m++) {
            const revealCode = key.substring((m - 1) * 2, m * 2);
            await prisma.member.create({
                data: {
                    teamId: team.id,
                    memberNo: m,
                    revealCode,
                    isJoined: false,
                    isSubmitted: false
                }
            });
        }
    }

    console.log('✅ Database seeded successfully!');
    console.log('   4 sets (A-D) with unlock keys');
    console.log('   36 snippets (4 sets × 3 members × 3 languages)');
    console.log('   20 teams (T01-T20) with 3 member slots each');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
