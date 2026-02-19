import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Placeholder buggy snippets — replace with actual competition code before event
const snippetsBySet: Record<string, Record<number, Record<string, string>>> = {
  A: {
    1: {
      c: `#include <stdio.h>
int main() {
    int arr[5] = {10, 20, 30, 40, 50};
    int sum = 0;
    for (int i = 0; i <= 5; i++) {  // Bug: off-by-one
        sum += arr[i];
    }
    printf("Sum: %d\\n", sum);
    return 0;
}`,
      java: `public class Main {
    public static void main(String[] args) {
        int[] arr = {10, 20, 30, 40, 50};
        int sum = 0;
        for (int i = 0; i <= arr.length; i++) {  // Bug: off-by-one
            sum += arr[i];
        }
        System.out.println("Sum: " + sum);
    }
}`,
      python: `arr = [10, 20, 30, 40, 50]
sum = 0
for i in range(6):  # Bug: off-by-one
    sum += arr[i]
print("Sum:", sum)`
    },
    2: {
      c: `#include <stdio.h>
int factorial(int n) {
    if (n == 0) return 1;
    return n * factorial(n);  // Bug: infinite recursion
}
int main() {
    printf("Factorial of 5: %d\\n", factorial(5));
    return 0;
}`,
      java: `public class Main {
    static int factorial(int n) {
        if (n == 0) return 1;
        return n * factorial(n);  // Bug: infinite recursion
    }
    public static void main(String[] args) {
        System.out.println("Factorial of 5: " + factorial(5));
    }
}`,
      python: `def factorial(n):
    if n == 0:
        return 1
    return n * factorial(n)  # Bug: infinite recursion

print("Factorial of 5:", factorial(5))`
    },
    3: {
      c: `#include <stdio.h>
#include <string.h>
int main() {
    char str[] = "hello";
    int len = strlen(str);
    char reversed[6];
    for (int i = 0; i < len; i++) {
        reversed[i] = str[len - i];  // Bug: should be len-1-i
    }
    reversed[len] = '\\0';
    printf("Reversed: %s\\n", reversed);
    return 0;
}`,
      java: `public class Main {
    public static void main(String[] args) {
        String str = "hello";
        int len = str.length();
        StringBuilder reversed = new StringBuilder();
        for (int i = 0; i < len; i++) {
            reversed.append(str.charAt(len - i));  // Bug: should be len-1-i
        }
        System.out.println("Reversed: " + reversed);
    }
}`,
      python: `text = "hello"
length = len(text)
reversed_str = ""
for i in range(length):
    reversed_str += text[length - i]  # Bug: should be length-1-i
print("Reversed:", reversed_str)`
    }
  },
  B: {
    1: {
      c: `#include <stdio.h>
int main() {
    int n = 5;
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= i; i++) {  // Bug: i++ should be j++
            printf("* ");
        }
        printf("\\n");
    }
    return 0;
}`,
      java: `public class Main {
    public static void main(String[] args) {
        int n = 5;
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= i; i++) {  // Bug: i++ should be j++
                System.out.print("* ");
            }
            System.out.println();
        }
    }
}`,
      python: `n = 5
for i in range(1, n + 1):
    for j in range(1, i + 1):
        i += 1  # Bug: should not modify i
        print("* ", end="")
    print()`
    },
    2: {
      c: `#include <stdio.h>
int isPrime(int n) {
    if (n < 2) return 0;
    for (int i = 2; i < n; i++) {
        if (n % i == 0) return 1;  // Bug: should return 0
    }
    return 0;  // Bug: should return 1
}
int main() {
    for (int i = 1; i <= 20; i++) {
        if (isPrime(i)) printf("%d ", i);
    }
    return 0;
}`,
      java: `public class Main {
    static boolean isPrime(int n) {
        if (n < 2) return false;
        for (int i = 2; i < n; i++) {
            if (n % i == 0) return true;  // Bug: should return false
        }
        return false;  // Bug: should return true
    }
    public static void main(String[] args) {
        for (int i = 1; i <= 20; i++) {
            if (isPrime(i)) System.out.print(i + " ");
        }
    }
}`,
      python: `def is_prime(n):
    if n < 2:
        return False
    for i in range(2, n):
        if n % i == 0:
            return True  # Bug: should return False
    return False  # Bug: should return True

for i in range(1, 21):
    if is_prime(i):
        print(i, end=" ")`
    },
    3: {
      c: `#include <stdio.h>
void bubbleSort(int arr[], int n) {
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {  // Bug: should be n-i-1
            if (arr[j] > arr[j+1]) {
                int temp = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = arr[j];  // Bug: should be temp
            }
        }
    }
}
int main() {
    int arr[] = {5, 3, 8, 1, 2};
    bubbleSort(arr, 5);
    for (int i = 0; i < 5; i++) printf("%d ", arr[i]);
    return 0;
}`,
      java: `public class Main {
    static void bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < n; j++) {  // Bug: should be n-i-1
                if (arr[j] > arr[j+1]) {
                    int temp = arr[j];
                    arr[j] = arr[j+1];
                    arr[j+1] = arr[j];  // Bug: should be temp
                }
            }
        }
    }
    public static void main(String[] args) {
        int[] arr = {5, 3, 8, 1, 2};
        bubbleSort(arr);
        for (int x : arr) System.out.print(x + " ");
    }
}`,
      python: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(n):  # Bug: should be n-i-1
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]  # Bug: index out of range
    return arr

arr = [5, 3, 8, 1, 2]
print(bubble_sort(arr))`
    }
  },
  C: {
    1: {
      c: `#include <stdio.h>
int fibonacci(int n) {
    if (n <= 0) return 0;
    if (n == 1) return 1;
    return fibonacci(n - 1) + fibonacci(n - 3);  // Bug: should be n-2
}
int main() {
    for (int i = 0; i < 10; i++)
        printf("%d ", fibonacci(i));
    return 0;
}`,
      java: `public class Main {
    static int fibonacci(int n) {
        if (n <= 0) return 0;
        if (n == 1) return 1;
        return fibonacci(n - 1) + fibonacci(n - 3);  // Bug: should be n-2
    }
    public static void main(String[] args) {
        for (int i = 0; i < 10; i++)
            System.out.print(fibonacci(i) + " ");
    }
}`,
      python: `def fibonacci(n):
    if n <= 0:
        return 0
    if n == 1:
        return 1
    return fibonacci(n - 1) + fibonacci(n - 3)  # Bug: should be n-2

for i in range(10):
    print(fibonacci(i), end=" ")`
    },
    2: {
      c: `#include <stdio.h>
int binarySearch(int arr[], int n, int target) {
    int low = 0, high = n;  // Bug: should be n-1
    while (low < high) {  // Bug: should be low <= high
        int mid = (low + high) / 2;
        if (arr[mid] == target) return mid;
        else if (arr[mid] < target) low = mid;  // Bug: should be mid+1
        else high = mid;  // Bug: should be mid-1
    }
    return -1;
}
int main() {
    int arr[] = {2, 5, 8, 12, 16, 23, 38};
    printf("Found at: %d\\n", binarySearch(arr, 7, 23));
    return 0;
}`,
      java: `public class Main {
    static int binarySearch(int[] arr, int target) {
        int low = 0, high = arr.length;  // Bug: should be length-1
        while (low < high) {  // Bug: should be low <= high
            int mid = (low + high) / 2;
            if (arr[mid] == target) return mid;
            else if (arr[mid] < target) low = mid;  // Bug: should be mid+1
            else high = mid;  // Bug: should be mid-1
        }
        return -1;
    }
    public static void main(String[] args) {
        int[] arr = {2, 5, 8, 12, 16, 23, 38};
        System.out.println("Found at: " + binarySearch(arr, 23));
    }
}`,
      python: `def binary_search(arr, target):
    low, high = 0, len(arr)  # Bug: should be len(arr)-1
    while low < high:  # Bug: should be low <= high
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid  # Bug: should be mid+1
        else:
            high = mid  # Bug: should be mid-1
    return -1

arr = [2, 5, 8, 12, 16, 23, 38]
print("Found at:", binary_search(arr, 23))`
    },
    3: {
      c: `#include <stdio.h>
int power(int base, int exp) {
    int result = 0;  // Bug: should be 1
    for (int i = 0; i < exp; i++) {
        result += base;  // Bug: should be result *= base
    }
    return result;
}
int main() {
    printf("2^10 = %d\\n", power(2, 10));
    return 0;
}`,
      java: `public class Main {
    static int power(int base, int exp) {
        int result = 0;  // Bug: should be 1
        for (int i = 0; i < exp; i++) {
            result += base;  // Bug: should be result *= base
        }
        return result;
    }
    public static void main(String[] args) {
        System.out.println("2^10 = " + power(2, 10));
    }
}`,
      python: `def power(base, exp):
    result = 0  # Bug: should be 1
    for i in range(exp):
        result += base  # Bug: should be result *= base
    return result

print("2^10 =", power(2, 10))`
    }
  },
  D: {
    1: {
      c: `#include <stdio.h>
int gcd(int a, int b) {
    while (b != 0) {
        int temp = b;
        b = a % b;
        a = b;  // Bug: should be a = temp
    }
    return a;
}
int main() {
    printf("GCD of 48 and 18: %d\\n", gcd(48, 18));
    return 0;
}`,
      java: `public class Main {
    static int gcd(int a, int b) {
        while (b != 0) {
            int temp = b;
            b = a % b;
            a = b;  // Bug: should be a = temp
        }
        return a;
    }
    public static void main(String[] args) {
        System.out.println("GCD of 48 and 18: " + gcd(48, 18));
    }
}`,
      python: `def gcd(a, b):
    while b != 0:
        temp = b
        b = a % b
        a = b  # Bug: should be a = temp
    return a

print("GCD of 48 and 18:", gcd(48, 18))`
    },
    2: {
      c: `#include <stdio.h>
int main() {
    int matrix[3][3] = {{1,2,3},{4,5,6},{7,8,9}};
    int transpose[3][3];
    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 3; j++) {
            transpose[i][j] = matrix[i][j];  // Bug: should be matrix[j][i]
        }
    }
    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 3; j++)
            printf("%d ", transpose[i][j]);
        printf("\\n");
    }
    return 0;
}`,
      java: `public class Main {
    public static void main(String[] args) {
        int[][] matrix = {{1,2,3},{4,5,6},{7,8,9}};
        int[][] transpose = new int[3][3];
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                transpose[i][j] = matrix[i][j];  // Bug: should be matrix[j][i]
            }
        }
        for (int[] row : transpose) {
            for (int val : row) System.out.print(val + " ");
            System.out.println();
        }
    }
}`,
      python: `matrix = [[1,2,3],[4,5,6],[7,8,9]]
transpose = [[0]*3 for _ in range(3)]
for i in range(3):
    for j in range(3):
        transpose[i][j] = matrix[i][j]  # Bug: should be matrix[j][i]

for row in transpose:
    print(*row)`
    },
    3: {
      c: `#include <stdio.h>
int main() {
    int arr[] = {3, 1, 4, 1, 5, 9, 2, 6};
    int n = 8;
    int max = arr[0];
    int min = arr[0];
    for (int i = 0; i < n; i++) {
        if (arr[i] > max) max = arr[i];
        if (arr[i] > min) min = arr[i];  // Bug: should be <
    }
    printf("Max: %d, Min: %d\\n", max, min);
    return 0;
}`,
      java: `public class Main {
    public static void main(String[] args) {
        int[] arr = {3, 1, 4, 1, 5, 9, 2, 6};
        int max = arr[0], min = arr[0];
        for (int i = 0; i < arr.length; i++) {
            if (arr[i] > max) max = arr[i];
            if (arr[i] > min) min = arr[i];  // Bug: should be <
        }
        System.out.println("Max: " + max + ", Min: " + min);
    }
}`,
      python: `arr = [3, 1, 4, 1, 5, 9, 2, 6]
max_val = arr[0]
min_val = arr[0]
for x in arr:
    if x > max_val:
        max_val = x
    if x > min_val:  # Bug: should be <
        min_val = x
print(f"Max: {max_val}, Min: {min_val}")`
    }
  }
};

const unlockKeys: Record<string, string> = {
  A: '482917',
  B: '735261',
  C: '194826',
  D: '653748'
};

async function main() {
  // Clear existing data
  await prisma.round2Submission.deleteMany();
  await prisma.keyAttempt.deleteMany();
  await prisma.member.deleteMany();
  await prisma.team.deleteMany();
  await prisma.snippet.deleteMany();
  await prisma.problemSet.deleteMany();

  // Create sets
  const sets: Record<string, { id: number }> = {};
  for (const setName of ['A', 'B', 'C', 'D']) {
    sets[setName] = await prisma.problemSet.create({
      data: {
        name: setName,
        unlockKey: unlockKeys[setName]
      }
    });
  }

  // Create snippets
  for (const [setName, members] of Object.entries(snippetsBySet)) {
    for (const [memberNoStr, languages] of Object.entries(members)) {
      for (const [language, code] of Object.entries(languages)) {
        await prisma.snippet.create({
          data: {
            setId: sets[setName].id,
            memberNo: parseInt(memberNoStr),
            language,
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
        name: `Team ${i}`,
        setId: sets[assignedSet].id,
        status: 'waiting'
      }
    });

    // Create 3 member slots per team
    for (let m = 1; m <= 3; m++) {
      await prisma.member.create({
        data: {
          teamId: team.id,
          memberNo: m,
          name: `Member ${m}`,
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
