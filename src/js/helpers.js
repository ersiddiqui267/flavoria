//Importing TIMEOUT_SEC
import { TIMEOUT_SEC } from './config.js';

//Promisifying setTimeout
const timer = function (sec) {
  return new Promise(function (_, reject) {
    setTimeout(
      reject,
      sec * 1000,
      `Request took too long! Timeout after ${sec} seconds.`
    );
  });
};

const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: `POST`,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const response = await Promise.race([fetchPro, timer(TIMEOUT_SEC)]);
    if (!response.ok) throw new Error(`Something went wrong! Try Again.`);
    const data = await response.json();
    return data;
  } catch (err) {
    throw err;
  }
};

export { AJAX };
