import { EventEmitter } from 'node:events'
import { api } from './api'

const uinRegex = /\d+/

const isUin = (uin: unknown) =>
  (typeof uin === 'string' && uin !== '0' && uinRegex.test(uin)) ||
  (typeof uin === 'number' && uin > 9999)

const isUid = (uid: unknown) =>
  typeof uid === 'string' && uid.length === 24 && uid.startsWith('u_')

const isGroup = isUin

export class Uix extends EventEmitter {
  map: Record<string, string> = {}

  isUin = isUin
  isUid = isUid
  isGroup = isGroup

  add = (uid: string, uin: string) => {
    if (!isUid(uid) || !isUin(uin)) return
    this.map[uid] = uin
    this.map[uin] = uid
    this.emit(uin, uid)
    this.emit(uid, uin)
  }

  /**
   * @deprecated
   */
  getUin = (uid: string) => {
    if (!isUid(uid)) return undefined
    const uin = this.map[uid]
    if (!isUin(uin)) return undefined
    return uin
  }

  getUin2 = async (uid: string, group: string | number | undefined) => {
    if (!isUid(uid)) return undefined
    let uin: string | undefined
    if (group) {
      if (!isGroup(group)) return undefined
      // const groupString = `${group}`
      try {
        uin = await api['chronocat.internal.uix.uin.get'](uid)
        // uin = await api['chronocat.internal.uix.uin.get.group'](uid, groupString)
      } catch (e) {
        // TODO
      }
    } else {
      try {
        uin = await api['chronocat.internal.uix.uin.get'](uid)
      } catch (e) {
        // TODO
      }
    }
    if (uin) this.add(uid, uin)
    return this.getUin(uid)
  }

  /**
   * @deprecated
   */
  getUid = (uin: string) => {
    if (!isUin(uin)) return undefined
    const uid = this.map[uin]
    if (!isUid(uid)) return undefined
    return uid
  }

  getUid2 = async (uin: string, _group: string | number | undefined) => {
    if (!isUin(uin)) return undefined
    // if (group) {
    //   if (!isGroup(group)) return undefined
    //   const groupString = `${group}`
    // }
    return this.getUid(uin)
  }
}

export const uix = new Uix()
