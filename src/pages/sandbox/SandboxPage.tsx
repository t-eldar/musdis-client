
/**
 * Page for testing components in isolation.
 */
const SandboxPage = () => {
  function createArray<T>(object: T, length: number) {
    const arr = [];
    for (let i = 0; i < length; i++) {
      arr.push({ ...object });
    }

    return arr;
  }

  return (
    <>
      <div>dsds</div>
    </>
  );
};

export default SandboxPage;
