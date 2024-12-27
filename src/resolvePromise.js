/**
 * Resolves a given promise and updates the provided promiseState object.
 * It attaches success and error handlers to the promise.
 *
 * @param {Promise} prms - The promise to resolve.
 * @param {Object} promiseState - The state object to store promise result data.
 */
export function resolvePromise(prms, promiseState) {
  if (!prms) return;

  promiseState.promise = prms;
  promiseState.data = null;
  promiseState.error = null;
  promiseState.loading = true;


  /**
   * Action callback for handling promise resolution success.
   * Updates the promiseState with the resolved data.
   *
   * @param {any} result - The result of the resolved promise.
   */
  function handleSuccessACB(result) {
    console.log("Promise resolved with data:", result);
    if (promiseState.promise !== prms) return;
    promiseState.data = result;
    promiseState.error = null;
  }

  /**
   * Action callback for handling promise rejection.
   * Updates the promiseState with the error.
   *
   * @param {Error} err - The error encountered during promise rejection.
   */
  function handleErrorACB(error) {
    if (promiseState.promise !== prms) return;
    promiseState.error = error;
    promiseState.data = null;
  }

  prms.then(handleSuccessACB).catch(handleErrorACB);
}

export default resolvePromise;
