import request from '~/api/request'

/**
 * 账户登录
 * @param {username: string, password: string} data
 * @returns
 */
export function login(data: any) {
  return request({
    url: '/sys-api/account/login',
    method: 'post',
    data,
  })
}

/**
 * 获取帐户信息
 * @param {string} token
 * @returns
 */
export function getUserProfile() {
  return request({
    url: '/sys-api/account/profile',
    method: 'get',
  })
}

/**
 * 注册帐户
 */
export function signup(data: any) {
  return request({
    url: '/sys-api/account/signup',
    method: 'post',
    data,
  })
}

/**
 * 编辑帐户信息
 */
export function edit(data: any) {
  return request({
    url: '/sys-api/account/edit',
    method: 'post',
    data,
  })
}

/**
 * 编辑帐户信息
 */
export function resetPassword(data: any) {
  return request({
    url: '/sys-api/account/resetPassword',
    method: 'post',
    data,
  })
}
