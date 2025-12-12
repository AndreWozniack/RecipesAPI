const AWS = require("aws-sdk");
const { S3_BUCKET, S3_KEY } = require("../config/env.js");
const Lista = require("../models/lista.model.js");

const s3 = new AWS.S3();

class StorageService {
  async carregarLista() {
    if (!S3_BUCKET) {
      console.warn("S3_BUCKET não configurado");
      return new Lista();
    }

    try {
      const result = await s3
        .getObject({
          Bucket: S3_BUCKET,
          Key: S3_KEY,
        })
        .promise();

      const data = JSON.parse(result.Body.toString());
      return new Lista(data);
    } catch (err) {
      if (err.code === "NoSuchKey") {
        return new Lista();
      }
      throw err;
    }
  }

  async salvarLista(lista) {
    if (!S3_BUCKET) {
      console.warn("S3_BUCKET não configurado");
      return;
    }

    await s3
      .putObject({
        Bucket: S3_BUCKET,
        Key: S3_KEY,
        Body: JSON.stringify(lista.toJSON(), null, 2),
        ContentType: "application/json",
        ServerSideEncryption: "AES256",
      })
      .promise();
  }

  async limparLista() {
    const listaVazia = new Lista();
    await this.salvarLista(listaVazia);
    return listaVazia;
  }
}

module.exports = new StorageService();
