#!/usr/bin/env python3
"""
Terminal input/output program
ターミナルで文字列の入力を受取り、それをターミナルで表示するためのプログラム
"""

def main():
    """Main function to handle terminal input and output"""
    print("Terminal Input/Output Program")
    print("Type 'quit' or 'exit' to terminate the program")
    print("-" * 40)
    
    while True:
        try:
            user_input = input("Please enter text: ")
            
            if user_input.lower() in ['quit', 'exit']:
                print("Program terminated. Goodbye!")
                break
            
            print(f"You entered: {user_input}")
            
        except KeyboardInterrupt:
            print("\nProgram interrupted. Goodbye!")
            break
        except EOFError:
            print("\nEnd of input detected. Goodbye!")
            break

if __name__ == "__main__":
    main()