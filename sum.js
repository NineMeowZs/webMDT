let sumFor = 0;

for (let i = 1; i <= 100; i++) {
  if (i % 5 === 0 || i % 2 === 0) {
    sumFor += i;
  }
}

console.log("ผลรวมจาก for loop:", sumFor);

let sumWhile = 0;
let i = 1;

while (i <= 100) {
  if (i % 2 === 0 || i % 5 === 0) {
    sumWhile += i;
  }
  i++;
}

console.log("ผลรวมจาก while loop:", sumWhile);

