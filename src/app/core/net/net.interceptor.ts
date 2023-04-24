import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
  HttpStatusCode,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  catchError,
  mergeMap,
  Observable,
  of,
  throwError,
  timeout,
  TimeoutError,
} from 'rxjs';

export type BaseResponse = {
  data: unknown;
  exception: string;
  message: string;
  status: string;
  timestamp: number;
};

@Injectable()
export class NetInterceptor implements HttpInterceptor {
  errorCodeMap = new Map<string, string>([
    ['SS00000#', '操作成功'],
    ['SSA0001#', '用户端异常'],
    ['SSA0100#', '用户注册错误'],
    ['SSA0101#', '用户未同意隐私协议'],
    ['SSA0102#', '注册国家或地区受限'],
    ['SSA0110#', '用户名校验失败'],
    ['SSA0111#', '用户名已存在'],
    ['SSA0112#', '用户名包含敏感词'],
    ['SSA0113#', '用户名包含特殊字符'],
    ['SSA0120#', '密码校验失败'],
    ['SSA0121#', '密码长度不正确'],
    ['SSA0122#', '密码强度不够'],
    ['SSA0130#', '校验码输入错误'],
    ['SSA0131#', '短信校验码输入错误'],
    ['SSA0132#', '邮件校验码输入错误'],
    ['SSA0133#', '语音校验码输入错误'],
    ['SSA0140#', '用户证件异常'],
    ['SSA0141#', '用户证件类型未选择'],
    ['SSA0142#', '大陆身份证编号校验非法'],
    ['SSA0143#', '护照编号校验非法'],
    ['SSA0144#', '军官证编号校验非法'],
    ['SSA0150#', '用户基本信息校验失败'],
    ['SSA0151#', '手机格式校验失败'],
    ['SSA0152#', '地址格式校验失败'],
    ['SSA0153#', '邮箱格式校验失败'],
    ['SSA0200#', '用户登录异常'],
    ['SSA0201#', '用户账户不存在'],
    ['SSA0202#', '用户账户被冻结'],
    ['SSA0203#', '用户账户已作废'],
    ['SSA0210#', '用户或密码错误'],
    ['SSA0211#', '用户输入密码错误次数超限'],
    ['SSA0220#', '用户身份校验失败'],
    ['SSA0221#', '用户指纹识别失败'],
    ['SSA0222#', '用户面容识别失败'],
    ['SSA0223#', '用户未获得第三方登录授权'],
    ['SSA0230#', '用户登录已过期'],
    ['SSA0240#', '用户验证码错误'],
    ['SSA0241#', '用户验证码尝试次数超限'],
    ['SSA0300#', '访问权限异常'],
    ['SSA0301#', '访问未授权'],
    ['SSA0302#', '正在授权中'],
    ['SSA0303#', '用户授权申请被拒绝'],
    ['SSA0310#', '因访问对象隐私设置被拦截'],
    ['SSA0311#', '授权已过期'],
    ['SSA0312#', '无权限使用API'],
    ['SSA0320#', '用户访问被拦截'],
    ['SSA0321#', '黑名单用户'],
    ['SSA0322#', '账号被冻结'],
    ['SSA0323#', '非法IP地址'],
    ['SSA0324#', '网关访问受限'],
    ['SSA0325#', '地域黑名单'],
    ['SSA0330#', '服务已欠费'],
    ['SSA0340#', '用户签名异常'],
    ['SSA0341#', 'RSA签名错误'],
    ['SSA0400#', '用户请求参数错误'],
    ['SSA0401#', '包含非法恶意跳转链接'],
    ['SSA0402#', '无效的用户输入'],
    ['SSA0410#', '请求必填参数为空'],
    ['SSA0411#', '用户订单号为空'],
    ['SSA0412#', '订购数量为空'],
    ['SSA0413#', '缺少时间戳参数'],
    ['SSA0414#', '非法的时间参数'],
    ['SSA0420#', '请求参数值超出允许的范围'],
    ['SSA0421#', '参数格式不匹配'],
    ['SSA0422#', '地址不在服务范围'],
    ['SSA0423#', '时间不在服务范围'],
    ['SSA0424#', '金额超出限制'],
    ['SSA0425#', '数量超出限制'],
    ['SSA0426#', '请求批量处理总个数超出限制'],
    ['SSA0427#', '请求JSON解析失败'],
    ['SSA0430#', '用户输入内容非法'],
    ['SSA0431#', '包含违禁敏感词'],
    ['SSA0432#', '图片包含违禁信息'],
    ['SSA0433#', '文件侵犯版权'],
    ['SSA0440#', '用户操作异常'],
    ['SSA0441#', '用户支付超时'],
    ['SSA0442#', '确认订单超时'],
    ['SSA0443#', '订单已关闭'],
    ['SSA0500#', '用户请求服务异常'],
    ['SSA0501#', '请求次数超出限制'],
    ['SSA0502#', '请求并发数超出限制'],
    ['SSA0503#', '用户操作请等待'],
    ['SSA0504#', 'WebSocket连接异常'],
    ['SSA0505#', 'WebSocket连接断开'],
    ['SSA0506#', '用户重复请求'],
    ['SSA0600#', '用户资源异常'],
    ['SSA0601#', '账户余额不足'],
    ['SSA0602#', '用户磁盘空间不足'],
    ['SSA0603#', '用户内存空间不足'],
    ['SSA0604#', '用户OSS容量不足'],
    ['SSA0605#', '用户配额已用光'],
    ['SSA0700#', '用户上传文件异常'],
    ['SSA0701#', '用户上传文件类型不匹配'],
    ['SSA0702#', '用户上传文件太大'],
    ['SSA0703#', '用户上传图片太大'],
    ['SSA0704#', '用户上传视频太大'],
    ['SSA0705#', '用户上传压缩文件太大'],
    ['SSA0800#', '用户当前版本异常'],
    ['SSA0801#', '用户安装版本与系统不匹配'],
    ['SSA0802#', '用户安装版本过低'],
    ['SSA0803#', '用户安装版本过高'],
    ['SSA0804#', '用户安装版本已过期'],
    ['SSA0805#', '用户API请求版本不匹配'],
    ['SSA0806#', '用户API请求版本过高'],
    ['SSA0807#', '用户API请求版本过低'],
    ['SSA0900#', '用户隐私未授权'],
    ['SSA0901#', '用户隐私未签署'],
    ['SSA0902#', '用户摄像头未授权'],
    ['SSA0903#', '用户相机未授权'],
    ['SSA0904#', '用户图片库未授权'],
    ['SSA0905#', '用户文件未授权'],
    ['SSA0906#', '用户位置信息未授权'],
    ['SSA0907#', '用户通讯录未授权'],
    ['SSA1000#', '用户设备异常'],
    ['SSA1001#', '用户相机异常'],
    ['SSA1002#', '用户麦克风异常'],
    ['SSA1003#', '用户听筒异常'],
    ['SSA1004#', '用户扬声器异常'],
    ['SSA1005#', '用户GPS定位异常'],
    ['SSB0001#', '系统执行出错'],
    ['SSB0100#', '系统执行超时'],
    ['SSB0101#', '系统订单处理超时'],
    ['SSB0200#', '系统容灾功能被触发'],
    ['SSB0210#', '系统限流'],
    ['SSB0220#', '系统功能降级'],
    ['SSB0300#', '系统资源异常'],
    ['SSB0310#', '系统资源耗尽'],
    ['SSB0311#', '系统磁盘空间耗尽'],
    ['SSB0312#', '系统内存耗尽'],
    ['SSB0313#', '文件句柄耗尽'],
    ['SSB0314#', '系统连接池耗尽'],
    ['SSB0315#', '系统线程池耗尽'],
    ['SSB0320#', '系统资源访问异常'],
    ['SSB0321#', '系统读取磁盘文件失败'],
    ['SSC0001#', '调用第三方服务出错'],
    ['SSC0100#', '中间件服务出错'],
    ['SSC0110#', 'RPC服务出错'],
    ['SSC0111#', 'RPC服务未找到'],
    ['SSC0112#', 'RPC服务未注册'],
    ['SSC0113#', '接口不存在'],
    ['SSC0120#', '消息服务出错'],
    ['SSC0121#', '消息投递出错'],
    ['SSC0122#', '消息消费出错'],
    ['SSC0123#', '消息订阅出错'],
    ['SSC0124#', '消息分组未查到'],
    ['SSC0130#', '缓存服务出错'],
    ['SSC0131#', 'key长度超过限制'],
    ['SSC0132#', 'value长度超过限制'],
    ['SSC0133#', '存储容量已满'],
    ['SSC0134#', '不支持的数据格式'],
    ['SSC0140#', '配置服务出错'],
    ['SSC0150#', '网络资源服务出错'],
    ['SSC0151#', 'VPN服务出错'],
    ['SSC0152#', 'CDN服务出错'],
    ['SSC0153#', '域名解析服务出错'],
    ['SSC0154#', '网关服务出错'],
    ['SSC0200#', '第三方系统执行超时'],
    ['SSC0210#', 'RPC执行超时'],
    ['SSC0220#', '消息投递超时'],
    ['SSC0230#', '缓存服务超时'],
    ['SSC0240#', '配置服务超时'],
    ['SSC0250#', '数据库服务超时'],
    ['SSC0300#', '数据库服务出错'],
    ['SSC0311#', '表不存在'],
    ['SSC0312#', '列不存在'],
    ['SSC0321#', '多表关联中存在多个相同名称的列'],
    ['SSC0331#', '数据库死锁'],
    ['SSC0341#', '主键冲突'],
    ['SSC0400#', '第三方容灾系统被触发'],
    ['SSC0401#', '第三方系统限流'],
    ['SSC0402#', '第三方功能降级'],
    ['SSC0500#', '通知服务出错'],
    ['SSC0501#', '短信提醒服务失败'],
    ['SSC0502#', '语音提醒服务失败'],
    ['SSC0503#', '邮件提醒服务失败'],
    ['SED0001#', '系统调用异常'],
    ['SED0100#', '验证失败'],
    ['SED0101#', '数据验证失败'],
    ['SED0102#', '错误码缺失'],
    ['SED0103#', '对象验证失败'],
    ['SED0200#', '操作非法'],
    ['SED0210#', '数据非法'],
    ['SED0211#', '配置数据非法'],
    ['SED0212#', '枚举数据非法'],
    ['SED0220#', '方法调用非法'],
    ['SED1000#', '操作失败'],
    ['SED1100#', '数据操作失败'],
    ['SED1110#', '数据修改失败'],
    ['SED1111#', '数据ID无法修改'],
    ['SED1112#', '数据创建时间无法修改'],
    ['SED1120#', '数据保存失败'],
    ['SED1120#', '关联数据保存失败'],
    ['SED1130#', '数据删除失败'],
    ['SED1140#', '存在关联数据'],
    ['SED1200#', 'IO操作失败'],
    ['SED1300#', '数据删除失败'],
    ['SEF9999#', '未知的异常'],
    ['SED1150#', '查询数据失败'],
    ['SED1151#', '查询数据已存在'],
    ['SED1152#', '下发任务失败'],
    ['SED1153#', '操作失败'],
    ['SED1154#', '修改行动状态失败'],
    ['SED1155#', '已存在意图、目标、方式相同的案例'],
    ['SED1156#', '未找到相关方案'],
    ['SED1157#', '未找到相关行动记录'],
    ['SE_D1150#', '查询数据失败'],
    ['SE_D1151#', '查询数据已存在'],
    ['SE_D1152#', '下发任务失败'],
    ['SE_D1153#', '操作失败'],
    ['SE_D1154#', '修改行动状态失败'],
    ['SE_D1155#', '已存在意图、目标、方式相同的案例'],
    ['SE_D1156#', '未找到相关方案'],
    ['SE_D1157#', '未找到相关行动记录'],
    ['SE_D1158#', '已添加过相关类型id,头实体id,尾实体id'],
  ]);

  constructor(private router: Router) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const req = request.clone({
      url: `/api/v1${request.url}`,
      // setHeaders: this.user.token ? { Authorization: this.user.token } : {},
    });

    const { responseType } = req;

    return next.handle(req).pipe(
      timeout(500000),
      mergeMap((httpEvent) => {
        if (httpEvent instanceof HttpErrorResponse) {
          return throwError(() => httpEvent);
        } else {
          if (httpEvent instanceof HttpResponse) {
            // 如果响应体里有携带 token ，则用其替换本地的 token
            // const authorization = httpEvent.headers.get('authorization')
            // if (authorization) {
            //   this.user.token = authorization
            // }

            if (responseType === 'json') {
              const { body } = httpEvent as HttpResponse<BaseResponse>;
              if (body) {
                const { data, message, status } = { ...body };
                if (status === 'SS00000#') {
                  return of(httpEvent.clone({ body: data ?? null }));
                } else {
                  throw Error(message ?? this.errorCodeMap.get(status));
                }
              }
            }
          }

          return of(httpEvent);
        }
      }),
      catchError((error: Error) => {
        if (error instanceof TimeoutError) {
          return throwError(() => Error('请求超时'));
        } else if (error instanceof HttpErrorResponse) {
          switch (error.status) {
            case HttpStatusCode.GatewayTimeout:
              return throwError(() => Error('请求超时'));
            case HttpStatusCode.Unauthorized: {
              this.router.navigate(['/login']);
              const { status, message } = error.error as BaseResponse;
              return throwError(() =>
                Error(
                  message
                    ? message
                    : status
                    ? this.errorCodeMap.get(status)
                    : '无法连接到服务器'
                )
              );
            }
            default: {
              const { status, message } = error.error as BaseResponse;
              return throwError(() =>
                Error(
                  message
                    ? message
                    : status
                    ? this.errorCodeMap.get(status)
                    : '无法连接到服务器'
                )
              );
            }
          }
        } else {
          return throwError(() => error);
        }
      })
    );
  }
}
