export function formatDate(date: Date): string {
	// Helper function to pad single digit numbers with a leading zero
	const padZero = (num: number): string => num.toString().padStart(2, '0');

	const year = date.getFullYear();
	const month = padZero(date.getMonth() + 1); // getMonth() returns 0-based month
	const day = padZero(date.getDate());

	const hours = padZero(date.getHours());
	const minutes = padZero(date.getMinutes());
	const seconds = padZero(date.getSeconds());

	// Construct the formatted date-time string
	return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// const jsonUpdate = Object.fromEntries(Object.entries(validatedUserBody).filter(([_, value]) => value != null));

export function parseUpdateModelObject(object: any) {
	return Object.fromEntries(Object.entries(object).filter(([_, value]) => value != null));
}
