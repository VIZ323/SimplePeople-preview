# 墨刃·孤行｜场景资源加载固定HTTPS诊断候选

固定入口：https://viz323.github.io/SimplePeople-preview/games/inkblade30.20261108-scene-loading-diagnostic.1/
只读加载诊断：https://viz323.github.io/SimplePeople-preview/games/inkblade30.20261108-scene-loading-diagnostic.1/?startupAudit=1

按住拖动走位，松手停步；长枪自动攻击，移动时也攻击。真实经验三选一、营地成长与行程使用本浏览器存档。同域不同版本路径共享存档与锁；请勿同时操作不同版本，本候选不会清除旧档。

这是debug=true的独立Web诊断候选，不是正式release，不替换default/latest。全部128PNG、2字体、13音频保留原字节，没有WebP或纹理压缩配置。营地先备13图+2字体，选关11图+2；整关及真实snapshot成员联合决定战斗范围，未知输入回到完整原包。此次本地ST01恢复66图+2/61个atlas矩形，ST16恢复92图+2/0个矩形；矩形不是额外PNG，目标就绪不代表全128图/130视觉项就绪。转场等待目标验证及真实首绘后才交互/推进，不追补等待时间。计数是实际项目，不是字节百分比。

原FontFace实际loaded后才赋字体/计数，每字体30秒失败截止是失败边界而非速度目标。仅有本地3个隔离context、6张整图和新局122tick/2.0333sim秒的有限采用；两原暂停恢复档0新增sim，保存值原样。不是所有恢复都已测，也不是新局0sim。固定HTTPS与手机尚未验证，P1仍开；物理显示完成时间不由interactiveAt证明。没有全30当前质量、全字库、完整倒地/连续动作、美术/环境、音频听感、平衡、SDK或用户终验结论。旧WebP候选和历史30关功能证据独立保留。

九份原许可见licenses/；逐文件身份见release-manifest.json。身份：
版本 inkblade30.20261108-scene-loading-diagnostic.1
sourceSHA 946c35b7f2326e0ee1ea304a8820f58b69304152ba2eb935a4c0a66640853a97
art inkblade30-art.20261107.22
sourceGit 125e0cf186af07731fd17e7d4ab2e57294199864
textureMode original-png-only
effectivePolicy scene-visual-loading.phase2.v1
buildToolSHA 94a2ad97b018409445a22fb8ff07ea946e1f2e9f1b546df83af8738a8095e87b
packagingToolSHA 481d9c0157d57b037cb785492e4a9c818bcc720b1428428399d52167e24c00f6
engine3.8.8 / debugtrue / diagnosticOnly / stageAcceptancefalse
