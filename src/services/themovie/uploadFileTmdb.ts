/* eslint-disable no-console */
import axios, { AxiosResponse } from "axios";
import path from "path";
import { createWriteStream } from 'fs';
import * as cliProgress from 'cli-progress';

const uploadTMDBFile = async (fileName: string): Promise<string | null> => {
  const tempPathForFile = path.resolve(`src/temp/${fileName}`)
  const fileUrl = `http://files.tmdb.org/p/exports/${fileName}`

  const progressBar = new cliProgress.SingleBar({
    format: '{bar} {percentage}% | ETA: {eta}s | {value}/{total} bytes',
  });

  const writer = createWriteStream(tempPathForFile);

  try {
    // Create a new Axios instance
    const axiosInstance = axios.create({
      responseType: 'stream',
    });

    // Make the request using Axios
    const response: AxiosResponse = await axiosInstance.get(fileUrl, {
      responseType: 'stream',
      onDownloadProgress: (progressEvent) => {
        const totalBytes = progressEvent.total;
        const downloadedBytes = progressEvent.loaded;

        // Start the progress bar if it hasn't started
        if (!progressBar.start) {
          progressBar.start(totalBytes as number, downloadedBytes);
        }

        // Update the progress bar
        progressBar.update(downloadedBytes);
      },
    });

    response.data.pipe(writer);
    // Finish the progress bar and close the write stream when download is complete
    await new Promise<void>((resolve) => {
      response.data.on('end', () => {
        progressBar.stop();
        writer.close();
        console.log('File downloaded successfully!');
        resolve();
      });
    });
    console.log("##END_UPLOAD")

    return tempPathForFile;
  } catch (error) {
    console.error('An error occurred during download:', error);
    return null;
  }
}

export default uploadTMDBFile

