export const baseURL = process.env.NEXT_BASE_URL || 'http://localhost:8000/';

const date = new Date();
const year = date.getFullYear();
const month = date.getMonth() + 1; // getMonth() returns a zero-based value (where zero indicates the first month of the year)
let cycleNumber;

if (month >= 1 && month <= 3) {
  cycleNumber = 0;
} else if (month >= 4 && month <= 7) {
  cycleNumber = 1;
} else {
  cycleNumber = 2;
}
export const currentCycle = `${year}-${cycleNumber}`;
