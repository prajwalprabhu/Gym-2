import { defineConfig } from '@hey-api/openapi-ts';
function removeFirstWordCamelCase(str) {
  // Find the index of the first uppercase letter after the first character
  let index = str.slice(1).search(/[A-Z]/) + 1;

  // If no uppercase letter is found, return an empty string
  if (index <= 0) return '';

  // Get the remaining string after the first word
  let remainingStr = str.slice(index);

  // Make the first character lowercase
  return remainingStr.charAt(0).toLowerCase() + remainingStr.slice(1);
}
export default defineConfig({
  client: '@hey-api/client-axios',
  input: 'http://localhost:8000/openapi.json',
  output: './src/client',
  services: {
    asClass: true,
    methodNameBuilder: (operation) => removeFirstWordCamelCase(operation.name),
  },
});
