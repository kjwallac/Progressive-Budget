const DATABASE_NAME = "offline_db";
const STORE_NAME = "transactions";

async function saveRecordLocally(financialTransaction) {
  console.log({ financialTransaction });
  await useIndexedDb(DATABASE_NAME, STORE_NAME, "put", financialTransaction);
}

async function reconcileLocalRecords(financialTransactions) {
  const records = await useIndexedDb(DATABASE_NAME, STORE_NAME, "get");
  const response = await fetch("/api/transaction/bulk", {
    method: "POST",
    body: JSON.stringify(records),
    headers: {
      Accept: "application/json, text/plain, */*",
      "Content-Type": "application/json",
    },
  });
  if (response.ok) {
    await Promise.all(
      records.map((record) =>
        useIndexedDb(DATABASE_NAME, STORE_NAME, "delete", record)
      )
    );
  }
  return [...financialTransactions, ...records];
}
