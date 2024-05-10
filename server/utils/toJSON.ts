export const toJSON = (content: any) =>
  JSON.stringify(content, (key, value) =>
    typeof value === "bigint" ? value.toString() : value
  );
