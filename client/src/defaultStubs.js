const stubs = {};

stubs.cpp = `#include<bits/stdc++.h>
using namespace std;

int main(){
cout<<"Hello this is CPP";
return 0;}

`;

stubs.py = `from time import sleep

for i in range(1,4):
  sleep(i)
  print(i)

`;

export default stubs;