/*
 * @Author: Maslow<wangfugen@126.com>
 * @Date: 2021-08-30 15:22:34
 * @LastEditTime: 2021-11-15 15:40:59
 * @Description: 
 */

import { Request, Response } from 'express'
import { IApplicationData } from '../../support/application'
import { checkPermission } from '../../support/permission'
import { CN_OSS_SERVICE_ACCOUNT, CONST_DICTS } from '../../constants'
import { DatabaseAgent } from '../../db'
import { MinioAgent } from '../../support/minio'
import { ObjectId } from 'mongodb'

/**
 * The handler of creating a bucket
 */
export async function handleUpdateServiceAccount(req: Request, res: Response) {


  const uid = req['auth']?.uid
  const app: IApplicationData = req['parsed-app']
  // check permission
  const { FILE_BUCKET_ADD } = CONST_DICTS.permissions
  const code = await checkPermission(uid, FILE_BUCKET_ADD.name, app)
  if (code) {
    return res.status(code).send()
  }

  const sa = await DatabaseAgent.db.collection(CN_OSS_SERVICE_ACCOUNT)
    .findOne({ appid: app.appid, status: 1 })

  const oss = await MinioAgent.New()
  if (sa) {

    const r0 = await oss.removeServiceAccount(sa.access_key)
    if (r0.status === 'error') {

      return res.status(400).send(r0)
    }
    // save it
    const ret0 = await DatabaseAgent.db.collection(CN_OSS_SERVICE_ACCOUNT)
      .updateOne({ appid: app.appid, _id: new ObjectId(sa._id) }, {
        $set: {
          "status": 0,
          "updated_at": new Date()
        }
      })

    if (ret0) { }

  }



  const r1 = await oss.addServiceAccount(app.appid)
  if (r1.status === 'error') {

    return res.status(400).send('Error: create oss user failed')
  }
  const data = {
    appid: app.appid,
    status: 1,
    access_key: r1.accessKey,
    access_secret: r1.secretKey,
    created_at: new Date(),
    updated_at: new Date(),

  }
  // save it
  const ret1 = await DatabaseAgent.db.collection(CN_OSS_SERVICE_ACCOUNT)
    .insertOne(data as any)

  if (ret1) { }

  return res.send({
    code: 0,
    data
  })





}