// src/utils/process.ts
function isProcessAlive(pid) {
  try {
    process.kill(pid, 0);
    return true;
  } catch (error) {
    const err = error;
    return err.code === "EPERM";
  }
}
export {
  isProcessAlive
};
