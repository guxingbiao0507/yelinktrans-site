# 源译官网上线验收清单

## 一、部署前

- [ ] 确认上线包文件名和版本为V1.0
- [ ] 确认中文页面版本为V1.0、英文页面版本为V1.2
- [ ] 确认正式域名为 `yelinktrans.com`
- [ ] 确认服务器或托管平台及所在地区
- [ ] 如使用中国大陆服务器，确认ICP备案条件已经满足
- [ ] 备份当前全部DNS记录
- [ ] 确认Microsoft 365邮箱收发正常
- [ ] 保留可回滚的旧配置

## 二、预发布站点

- [ ] 预发布地址已设置访问保护或禁止搜索引擎索引
- [ ] 中文首页、服务与经验、协作方式、联系合作、隐私政策可访问
- [ ] 英文Home、Services & Expertise、How We Work、Contact、Privacy Policy可访问
- [ ] 所有页面直接输入网址和刷新均正常
- [ ] 不存在横向滚动条、文字重叠、裁切或孤立单词换行
- [ ] 中文和英文切换均进入对应页面
- [ ] 主导航、页脚、按钮和锚点链接可用
- [ ] James和Mike邮箱链接调用正确地址
- [ ] 360、390、768、1024、1440和1920像素宽度通过检查
- [ ] Windows笔记本、iPhone或iPad、Android手机各完成一次真实设备检查
- [ ] 键盘Tab导航和焦点提示可见
- [ ] 浏览器控制台无生产错误

## 三、SEO与分享

- [ ] 每页只有一个H1
- [ ] 中文和英文页面标题、描述、Canonical和hreflang正确
- [ ] 中文页面使用 `/og-image.png`
- [ ] 英文页面使用 `/og-image-en.png`
- [ ] `https://yelinktrans.com/robots.txt` 可访问
- [ ] `https://yelinktrans.com/sitemap.xml` 可访问并包含10条公开路由
- [ ] `https://yelinktrans.com/404-test` 返回自定义404页面和正确HTTP状态
- [ ] 微信或企业微信分享中文页面显示中文分享图
- [ ] LinkedIn或其他平台分享英文页面显示英文分享图

## 四、正式域名与HTTPS

- [ ] `https://yelinktrans.com` 使用有效HTTPS证书
- [ ] HTTP自动跳转至HTTPS
- [ ] `www.yelinktrans.com` 301跳转至 `https://yelinktrans.com`
- [ ] 根域名不出现循环跳转
- [ ] 旧DNS记录和Microsoft 365邮箱记录未被删除
- [ ] DNS切换后完成James、Mike及外部邮箱互发测试

## 五、性能和安全

- [ ] `/_nuxt/`哈希资源使用长期缓存
- [ ] HTML使用重新验证缓存，内容更新后不会长期显示旧版本
- [ ] 返回 `X-Content-Type-Options: nosniff`
- [ ] 返回合理的Referrer-Policy和Permissions-Policy
- [ ] 公网目录不包含源码、合同、审核文档、环境变量或密钥
- [ ] 网站不加载未批准的第三方统计、广告或追踪脚本
- [ ] 当前无在线留言表单、数据库和服务器API依赖

## 六、上线后24小时

- [ ] 分别使用中国移动、中国联通或中国电信网络抽查访问
- [ ] 抽查海外网络访问
- [ ] 再次测试中英文切换和邮件链接
- [ ] 检查404、Sitemap和robots
- [ ] 记录首次上线时间、部署平台和负责人
- [ ] 将上线包、DNS备份和部署账号归档

## 七、上线后7天

- [ ] 确认网站和邮箱无异常
- [ ] 决定是否提交Google Search Console、Bing Webmaster和百度搜索资源平台
- [ ] 建立内容修改、审核、构建和重新部署流程
