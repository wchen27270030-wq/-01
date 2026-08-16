import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeftIcon,
  BackpackIcon,
  BadgeIcon,
  BarChartIcon,
  BellIcon,
  BookmarkIcon,
  CalendarIcon,
  CameraIcon,
  CheckCircledIcon,
  ChevronRightIcon,
  ClipboardIcon,
  ClockIcon,
  CubeIcon,
  DashboardIcon,
  DesktopIcon,
  FileTextIcon,
  GlobeIcon,
  HeartIcon,
  HomeIcon,
  IdCardIcon,
  InfoCircledIcon,
  LockClosedIcon,
  MagnifyingGlassIcon,
  MixerHorizontalIcon,
  MobileIcon,
  PaperPlaneIcon,
  PersonIcon,
  PlusIcon,
  ReaderIcon,
  ReloadIcon,
  SewingPinIcon,
  Share1Icon,
  StarIcon,
  TargetIcon,
} from "@radix-ui/react-icons";
import { BottomSheet, KeyboardInput, KeyboardTextarea, MobileScroll, useKeyboard } from "./mobile";
import "./prototype.css";

type IconType = typeof HomeIcon;
type ModuleKey = "trace" | "farm" | "cold" | "brand" | "trade" | "finance";
type MainTab = "home" | "code" | "mine";
type DemoScenario = "farmer-pending" | "farmer-empty" | "org-admin" | "org-business" | "org-viewer" | "org-invited" | "gov-staff" | "bank-staff" | "ops-staff";
type TraceAction = "start" | "record" | "harvest";
type FarmCategory = keyof typeof farmResources;
type DemandScene = "published" | "confirm" | "completed";
type FarmManagementTab = "demand" | "resource";
type ResourcePublishState = "已发布" | "已暂停" | "已下架";
type FarmContactMode = "chat" | "callback";
type OrgAuthStage = "supplement" | "review" | "approved";
type BusinessAction =
  | "cold-demand"
  | "cold-provider"
  | "brand-create"
  | "brand-apply"
  | "brand-batch"
  | "trade-supply"
  | "trade-demand"
  | "trade-intent"
  | "trade-delivery"
  | "trade-receipt"
  | "finance-intent"
  | "finance-channel";
type BusinessRecordState = "draft" | "submitted" | "responded" | "confirmed";
type TraceBatchKey = "mushroom" | "rice";
type WorkspaceSheet = "invite" | "product" | null;
type MembershipStage = "invite" | "pending" | "active";
type BankIntentState = "意向已提交" | "待联系" | "已联系" | "已转银行渠道";
type GovernmentWorkOrderState = "待签收" | "处理中" | "待复核";
type OperationsTaskState = "待签收" | "处理中" | "待验证";
type NavigationMode = "push" | "replace" | "reset";
type View =
  | MainTab
  | "module"
  | "realname"
  | "actor"
  | "farmer-profile"
  | "farmer-success"
  | "farm-demand"
  | "farm-service-detail"
  | "farm-contact"
  | "cold-map"
  | "business-detail"
  | "business-gate"
  | "business-form"
  | "business-management"
  | "business-record"
  | "brand-products"
  | "farm-management"
  | "farm-demand-detail"
  | "farm-resource-detail"
  | "farm-resource-edit"
  | "workbench"
  | "org-setup"
  | "join-org"
  | "institution"
  | "restricted-space"
  | "provider-apply"
  | "trace-start"
  | "trace-record"
  | "trace-harvest"
  | "trace-result"
  | "trace-center"
  | "trace-cycle-detail"
  | "trace-batches"
  | "trace-batch-detail"
  | "trace-public"
  | "org-auth"
  | "org-auth-progress"
  | "org-auth-supplement"
  | "role-management"
  | "workspace-center"
  | "membership-pending"
  | "member-permission-setup"
  | "member-active-result"
  | "bank-intents"
  | "bank-intent-detail"
  | "bank-contact"
  | "gov-area-overview"
  | "gov-work-orders"
  | "gov-work-order-detail"
  | "ops-tasks"
  | "ops-task-detail"
  | "ops-formal-review"
  | "ops-shift-handover";

type ModuleItem = {
  key: ModuleKey;
  name: string;
  short: string;
  publicTitle: string;
  publicDesc: string;
  primary: string;
  secondary: string;
  icon: IconType;
  tone: string;
};

const modules: ModuleItem[] = [
  {
    key: "trace",
    name: "码上溯源",
    short: "查产品、看批次",
    publicTitle: "扫一扫，查看真实生产信息",
    publicDesc: "查询主体公开信息、产品档案与批次追溯；公开页按来源展示，不把主体码当作质量合格证明。",
    primary: "扫一扫溯源码",
    secondary: "搜索产品或批次",
    icon: FileTextIcon,
    tone: "jade",
  },
  {
    key: "farm",
    name: "码上农服",
    short: "找农事、农资、农技",
    publicTitle: "像订服务一样找农服",
    publicDesc: "先选需求、区域和时间，查看符合条件的农事服务、农资资源与政府农技人员名单。",
    primary: "查找农事服务",
    secondary: "发布农事需求",
    icon: BackpackIcon,
    tone: "gold",
  },
  {
    key: "cold",
    name: "码上冷链",
    short: "找冷库、预冷、运输",
    publicTitle: "地图查找附近冷链",
    publicDesc: "按温区、品类、距离查看冷库与冷藏运输资源；可用能力以服务方更新时间为准。",
    primary: "地图找冷链",
    secondary: "发布冷链需求",
    icon: CubeIcon,
    tone: "sage",
  },
  {
    key: "brand",
    name: "码上品牌",
    short: "看品牌、查授权",
    publicTitle: "随州特色品牌矩阵",
    publicDesc: "浏览品牌介绍、授权摘要和关联产品。申请品牌用标前，需先有认证主体与产品档案。",
    primary: "浏览品牌矩阵",
    secondary: "申请产品用标",
    icon: BadgeIcon,
    tone: "vermilion",
  },
  {
    key: "trade",
    name: "码上交易",
    short: "看原粮、成品供需",
    publicTitle: "真实供需信息撮合",
    publicDesc: "公开浏览原粮、成品与加工品供需线索；一期不做线上支付、结算和平台担保。",
    primary: "浏览供需大厅",
    secondary: "发布供应信息",
    icon: BarChartIcon,
    tone: "amber",
  },
  {
    key: "finance",
    name: "码上金融",
    short: "看正规金融产品",
    publicTitle: "正规机构惠农产品",
    publicDesc: "查看银行产品与官方办理渠道；溯源仅作为经授权的补充材料，平台不授信、不放贷。",
    primary: "查看金融产品",
    secondary: "提交银行服务意向",
    icon: IdCardIcon,
    tone: "moss",
  },
];

const publicCards: Record<ModuleKey, { title: string; meta: string; tag: string }[]> = {
  trace: [
    { title: "随州香菇 · 春季示范批次", meta: "厉山镇 · 生产记录 6 条 · 2026-08-12 更新", tag: "可追溯" },
    { title: "优质香稻 · 示范生产档案", meta: "随县 · 地块与农事来源已标注", tag: "公开档案" },
  ],
  farm: [
    { title: "水稻机械收割服务", meta: "曾都区 · 6 家已核验服务主体", tag: "距您 2.8km" },
    { title: "香菇生产技术咨询", meta: "随州市农技推广中心公开名单", tag: "农技名录" },
  ],
  cold: [
    { title: "随州惠农冷链中心", meta: "冷藏 0—8℃ · 2026-08-13 更新", tag: "距您 3.2km" },
    { title: "鲜达冷藏运输", meta: "曾都区 · 香菇/果蔬冷藏运输", tag: "地图可查" },
  ],
  brand: [
    { title: "随州香菇", meta: "区域公用品牌 · 授权产品可查询", tag: "开放查询" },
    { title: "随州香稻", meta: "产业品牌专区 · 一期建设中", tag: "试点产业" },
  ],
  trade: [
    { title: "鲜香菇供应 2,000kg", meta: "曾都区 · 可分批交付 · 线下协商", tag: "供应" },
    { title: "采购优质稻谷 30 吨", meta: "随县 · 规格要求已公开", tag: "需求" },
  ],
  finance: [
    { title: "惠农信用贷", meta: "随州农商行 · 具体条件以银行审核为准", tag: "银行产品" },
    { title: "农机购置金融服务", meta: "正规机构渠道 · 平台不承诺审批", tag: "官方渠道" },
  ],
};

const businessActionLabels: Record<BusinessAction, string> = {
  "cold-demand": "发布冷链需求",
  "cold-provider": "申请成为冷链服务方",
  "brand-create": "建立我的品牌",
  "brand-apply": "申请使用品牌",
  "brand-batch": "登记批次用标",
  "trade-supply": "发布供应信息",
  "trade-demand": "发布采购需求",
  "trade-intent": "提交合作意向",
  "trade-delivery": "登记实际交付",
  "trade-receipt": "确认接收结果",
  "finance-intent": "提交银行服务意向",
  "finance-channel": "前往银行官方渠道",
};

const businessActionModule: Record<BusinessAction, Exclude<ModuleKey, "trace" | "farm">> = {
  "cold-demand": "cold",
  "cold-provider": "cold",
  "brand-create": "brand",
  "brand-apply": "brand",
  "brand-batch": "brand",
  "trade-supply": "trade",
  "trade-demand": "trade",
  "trade-intent": "trade",
  "trade-delivery": "trade",
  "trade-receipt": "trade",
  "finance-intent": "finance",
  "finance-channel": "finance",
};

const actionStepCount: Record<BusinessAction, number> = {
  "cold-demand": 4,
  "cold-provider": 3,
  "brand-create": 4,
  "brand-apply": 4,
  "brand-batch": 3,
  "trade-supply": 4,
  "trade-demand": 4,
  "trade-intent": 3,
  "trade-delivery": 3,
  "trade-receipt": 2,
  "finance-intent": 3,
  "finance-channel": 1,
};

type ActionField = { label: string; value: string; input?: boolean };
type ActionStep = { title: string; desc: string; fields: ActionField[]; notice?: string };

const businessActionSteps: Record<BusinessAction, ActionStep[]> = {
  "cold-demand": [
    { title: "需要哪类冷链服务？", desc: "先选预冷、冷库或冷藏运输，不要求填写设备参数。", fields: [{ label: "服务类型", value: "冷库 · 冷藏0—5℃" }, { label: "需求来源", value: "从鲜香菇采收批次带入" }] },
    { title: "这批货是什么？", desc: "优先引用已有批次，减少重复录入。", fields: [{ label: "产品/批次", value: "鲜香菇 · SN-PC-20260815-016" }, { label: "预计数量", value: "约600斤", input: true }, { label: "温控建议", value: "按鲜香菇模板 · 0—5℃" }] },
    { title: "什么时候、存在哪里？", desc: "容量按时段确认，不能展示成全渠道实时余量。", fields: [{ label: "计划入库", value: "明天下午 14:00—17:00" }, { label: "预计存放", value: "3天" }, { label: "希望区域", value: "曾都区 · 20km内" }, { label: "装卸条件", value: "小货车可到 · 需协助卸货" }] },
    { title: "核对温控与联系范围", desc: "精确地址和手机号只向选定机构限时披露。", fields: [{ label: "温度范围", value: "0—5℃ · 需节点记录" }, { label: "联系方式", value: "138****2286" }, { label: "公开位置", value: "厉山镇 · 精确点位不公开" }, { label: "需求有效期", value: "至2026-08-17 18:00" }], notice: "发布后形成冷链需求，不是预约或订单；机构响应后仍需双方确认服务安排。" },
  ],
  "cold-provider": [
    { title: "确认办理主体", desc: "冷链服务资源必须归属已认证组织。", fields: [{ label: "当前主体", value: "湖北随州丰禾农业有限公司" }, { label: "申请能力", value: "冷库/预冷服务" }] },
    { title: "补充设施与温控材料", desc: "材料按资源和有效期维护，不以一张证覆盖全部能力。", fields: [{ label: "固定设施", value: "厉山镇惠农冷链中心" }, { label: "温区能力", value: "冷藏0—5℃ · 冷冻-18℃" }, { label: "温控记录", value: "连续设备记录" }, { label: "公开点位", value: "对外服务入口 · 允许导航" }] },
    { title: "提交能力申请", desc: "通过后才能上架具体资源；PC 可批量维护时段额度。", fields: [{ label: "联系人", value: "刘经理 · 138****6092" }, { label: "材料有效期", value: "至2027-03-31" }, { label: "审核范围", value: "主体、设施、温控与公开位置" }], notice: "平台只核验材料来源和业务能力，不替代现场安全检查或行政许可。" },
  ],
  "brand-create": [
    { title: "确认品牌建立主体", desc: "创建草稿前校验经营主体；个人需具备适用经营主体资格。", fields: [{ label: "当前主体", value: "湖北随州丰禾农业有限公司" }, { label: "品牌关系", value: "权利人/受托管理方" }] },
    { title: "填写品牌基本信息", desc: "品牌定位、产业和区域分别维护。", fields: [{ label: "品牌名称", value: "丰禾香稻", input: true }, { label: "品牌定位", value: "企业品牌" }, { label: "产业/产品", value: "香稻 · 大米" }, { label: "主要区域", value: "随州市 · 曾都区" }] },
    { title: "关联权利与管理依据", desc: "逐项展示来源、编号摘要、状态和有效期，不合并成“已认证”。", fields: [{ label: "依据类型", value: "注册商标" }, { label: "编号摘要", value: "第72****86号" }, { label: "权利主体", value: "湖北随州丰禾农业有限公司" }, { label: "材料来源", value: "主体提交 · 待运营形式核验" }] },
    { title: "确认公开范围并提交", desc: "公众页不公开证照原件、合同、手机号和内部审核意见。", fields: [{ label: "代表产品", value: "原粮、大米" }, { label: "公开管理主体", value: "显示组织全称" }, { label: "线上申请", value: "暂不开启，建档后配置规则" }, { label: "资料版本", value: "V1 · 2026-08-15" }], notice: "品牌建档不等于政府认证或品质保证；运营只做形式核验，不作权属司法认定。" },
  ],
  "brand-apply": [
    { title: "确认申请主体与品牌", desc: "从品牌详情进入时锁定目标品牌，办理中不可切换主体。", fields: [{ label: "申请主体", value: "湖北随州丰禾农业有限公司" }, { label: "申请品牌", value: "随州香菇" }, { label: "规则预检", value: "主体与区域初步匹配" }] },
    { title: "选择产品与使用范围", desc: "授权必须落到具体产品、区域、场所和渠道。", fields: [{ label: "产品/SKU", value: "干香菇 · 250g礼盒" }, { label: "生产/包装场所", value: "厉山镇1号加工车间" }, { label: "销售渠道", value: "线下经销、团采" }, { label: "申请期限", value: "2026-09-01—2027-08-31" }] },
    { title: "引用质量与追溯材料", desc: "已有材料按对象引用，不重复上传；无检测不能写成不合格。", fields: [{ label: "产品档案", value: "SN-PD-000628 · 已关联" }, { label: "生产批次", value: "近6个月3个批次" }, { label: "质量材料", value: "检测报告1份 · 主体自控2项" }, { label: "包装样稿", value: "V2 · 待品牌方确认" }] },
    { title: "确认申请快照", desc: "品牌方若调整范围，必须由申请人再次确认后才生成授权。", fields: [{ label: "申请范围", value: "1个SKU · 1个场所 · 2类渠道" }, { label: "当前处理方", value: "随州香菇品牌管理办公室" }, { label: "联系人", value: "王建国 · 138****2286" }, { label: "申请版本", value: "V1" }], notice: "申请通过只生成结构化授权关系，不代表每个批次自动获准用标。" },
  ],
  "brand-batch": [
    { title: "选择生产批次", desc: "批次必须归当前主体且追溯关键项已完成。", fields: [{ label: "产品批次", value: "干香菇 · SN-PC-20260815-016" }, { label: "生产主体", value: "湖北随州丰禾农业有限公司" }] },
    { title: "选择授权与包装版本", desc: "系统校验授权产品、场所、渠道、期限与包装适用范围。", fields: [{ label: "品牌授权", value: "随州香菇 · 有效至2027-08-31" }, { label: "包装版本", value: "250g礼盒 V2 · 有效" }, { label: "计划用标数量", value: "800盒", input: true }] },
    { title: "确认校验结果", desc: "通过后把授权快照和包装版本写入批次追溯。", fields: [{ label: "授权命中", value: "产品/场所/渠道/期限均匹配" }, { label: "追溯完整度", value: "关键项已完成" }, { label: "写入对象", value: "SN-PC-20260815-016" }], notice: "后续授权到期不抹除历史快照，但禁止新增用标。" },
  ],
  "trade-supply": [
    { title: "选择供应货品阶段", desc: "原粮、加工原料和品牌成品使用不同动态字段。", fields: [{ label: "货品阶段", value: "初级农产品" }, { label: "产品/形态", value: "鲜香菇" }] },
    { title: "关联真实来源与质量证据", desc: "优先引用已有批次和证据，不重复上传。", fields: [{ label: "来源批次", value: "SN-PC-20260815-016" }, { label: "参考可供量", value: "约2,000kg", input: true }, { label: "规格", value: "菇径4—6cm · 一级" }, { label: "质量证据", value: "承诺达标合格证 · 主体自控记录" }] },
    { title: "填写参考条件", desc: "价格和数量都要有更新时间，不能称为实时库存或成交价。", fields: [{ label: "价格方式", value: "面议" }, { label: "最小响应量", value: "200kg" }, { label: "交付区域", value: "曾都区 · 可协商送达" }, { label: "是否需冷链", value: "是 · 0—5℃" }] },
    { title: "核对公开信息", desc: "精确地址和私人手机号在双方同意后交换。", fields: [{ label: "发布主体", value: "王建国农户" }, { label: "有效期", value: "至2026-08-18 18:00" }, { label: "公开位置", value: "厉山镇" }, { label: "联系方式", value: "平台内申请联系" }], notice: "供应信息只用于撮合，不是在线商品、库存承诺或付款凭证。" },
  ],
  "trade-demand": [
    { title: "选择采购主体和货品", desc: "一期大宗采购需求只允许已认证经营组织发布。", fields: [{ label: "采购主体", value: "湖北随州丰禾农业有限公司" }, { label: "货品阶段", value: "原粮" }, { label: "产品", value: "优质香稻稻谷" }] },
    { title: "填写规格与质量要求", desc: "关键指标可选“可协商”，不把未知写成检测通过。", fields: [{ label: "需求量", value: "30吨", input: true }, { label: "品种/年度", value: "鄂香2号 · 2026年" }, { label: "水分要求", value: "≤14.5% · 可协商" }, { label: "证据要求", value: "追溯批次/检测/主体承诺任一" }] },
    { title: "安排时间与交付", desc: "支持阶段用量和分批到货。", fields: [{ label: "到货计划", value: "9月1—20日 · 分3批" }, { label: "最低响应量", value: "5吨" }, { label: "收货区域", value: "曾都区加工园" }, { label: "价格方式", value: "面议 · 含运条件待协商" }] },
    { title: "确认可见性与联系人", desc: "平台不披露内部采购预算、合同或精确收货地址。", fields: [{ label: "可见范围", value: "随州市已认证供应主体" }, { label: "联系人", value: "刘经理 · 平台内联系" }, { label: "需求截止", value: "2026-08-25 18:00" }], notice: "采购需求不是招标公告或订单；合同、付款和结算在线下或外部渠道完成。" },
  ],
  "trade-intent": [
    { title: "确认供需对象", desc: "合作意向从当前公开信息带入，不重复填写主体和产品。", fields: [{ label: "目标供应", value: "鲜香菇供应2,000kg" }, { label: "意向主体", value: "王建国农户" }] },
    { title: "填写合作意向摘要", desc: "敏感成交价可以保持面议。", fields: [{ label: "意向数量", value: "500kg", input: true }, { label: "预计交付", value: "2026-08-18—20" }, { label: "交付方式", value: "对方送达 · 需冷链" }, { label: "价格摘要", value: "面议" }] },
    { title: "授权联系并提交", desc: "双方确认后才进入交付记录，不自动生成订单。", fields: [{ label: "联系目的", value: "确认供量、看样" }, { label: "联系方式", value: "手机号限时交换" }, { label: "意向有效期", value: "3天" }], notice: "合作意向不产生付款或交货义务，正式约定以双方外部合同为准。" },
  ],
  "trade-delivery": [
    { title: "选择已确认合作意向", desc: "只有双方已确认的意向才能登记交付。", fields: [{ label: "意向编号", value: "JY-YX-20260818-006" }, { label: "供方/需方", value: "丰禾农业 → 优鲜加工" }] },
    { title: "登记实际货物与运输", desc: "来源批次和实际经办人必须保留。", fields: [{ label: "来源批次", value: "SN-PC-20260815-016" }, { label: "交付数量", value: "498kg", input: true }, { label: "发出时间", value: "2026-08-18 08:30" }, { label: "运输", value: "鲜达冷链 · 运单摘要已关联" }] },
    { title: "核对随货证据", desc: "交付记录等待收方确认，不等同平台成交。", fields: [{ label: "合格证", value: "CN-HGZ-20260818-028" }, { label: "现场凭证", value: "装车照片3张" }, { label: "预计到达", value: "2026-08-18 10:30" }], notice: "提交后生成待接收记录；数量、规格或质量差异必须由收方确认并留痕。" },
  ],
  "trade-receipt": [
    { title: "核对交付事实", desc: "接收方确认实际数量和差异，不直接覆盖供方记录。", fields: [{ label: "交付编号", value: "JY-JF-20260818-011" }, { label: "交付数量", value: "498kg" }, { label: "接收主体", value: "随州优鲜农产品有限公司" }] },
    { title: "确认接收与后续去向", desc: "结果会形成接收批次并回写溯源。", fields: [{ label: "接收结果", value: "部分接收" }, { label: "实收数量", value: "492kg", input: true }, { label: "差异原因", value: "运输损耗6kg" }, { label: "货物去向", value: "进入加工批次" }, { label: "质量处置", value: "正常" }], notice: "更正采用冲正/替代关系，原交付和接收事实永久保留。" },
  ],
  "finance-intent": [
    { title: "确认银行产品与办理主体", desc: "这里只提交服务意向，不是贷款申请。", fields: [{ label: "银行/产品", value: "随州农商行 · 香菇经营周转服务" }, { label: "当前主体", value: "王建国农户" }, { label: "经营项目", value: "香菇种植与初加工" }] },
    { title: "填写最小联系意向", desc: "不采集银行卡、征信、合同和高敏感原件。", fields: [{ label: "资金用途意向", value: "菌棒/原料与经营周转" }, { label: "意向金额", value: "30万元以内", input: true }, { label: "意向期限", value: "12个月" }, { label: "银行客户状态", value: "不确定" }] },
    { title: "选择数据授权范围", desc: "经营数据为可选的一次性固定快照，按对象、目的和期限逐项确认。", fields: [{ label: "联系人授权", value: "仅本次指定银行 · 必选" }, { label: "经营数据", value: "主体、近12个月生产与批次摘要" }, { label: "不提供", value: "身份证原件、银行卡、征信、内部备注" }, { label: "读取截止", value: "2026-09-15" }], notice: "银行的真实申请、材料提交、审批、签约、放款和还款全部在银行官方渠道完成。" },
  ],
  "finance-channel": [
    { title: "即将进入银行官方渠道", desc: "请核对提供方、渠道域名和风险提示。", fields: [{ label: "提供机构", value: "随州农商行" }, { label: "办理渠道", value: "银行自营小程序/线下网点" }, { label: "官方客服", value: "96568" }, { label: "数据传递", value: "本次不自动传递经营数据" }], notice: "离开神农码后由银行提供服务。请勿向非官方人员支付贷款手续费或提供验证码。" },
  ],
};

const farmTypes = ["水稻收割", "耕整地", "播种插秧", "植保作业", "烘干服务", "香菇生产服务"];

const farmResources = {
  农事: [
    { name: "水稻机械收割服务", provider: "随州丰收农机服务中心", kind: "认证农服机构", distance: "2.8km", rating: "4.8（23条）", fee: "参考 88—95元/亩", status: "近7天可接洽", tags: ["区域覆盖", "规模适合", "证照有效"] },
    { name: "稻谷移动烘干服务", provider: "曾都惠农综合服务站", kind: "认证农服机构", distance: "5.6km", rating: "4.6（11条）", fee: "按吨面议", status: "时间待确认", tags: ["支持香稻", "可到场服务", "资料已核"] },
  ],
  农资: [
    { name: "香稻种子与肥料咨询", provider: "厉山镇农资服务中心", kind: "已核验农资机构", distance: "3.4km", rating: "4.7（18条）", fee: "产品价格到店咨询", status: "今日可咨询", tags: ["种子种苗", "肥料", "来源可查"] },
    { name: "香菇菌种菌棒供应咨询", provider: "随州菇源农业有限公司", kind: "已核验农资机构", distance: "8.2km", rating: "暂无足够评价", fee: "按规格面议", status: "工作日可咨询", tags: ["香菇产业", "批次来源", "材料有效"] },
  ],
  农技: [
    { name: "水稻病虫害技术咨询", provider: "随州市农业技术推广中心", kind: "政府公开农技名单", distance: "服务随州市", rating: "不参与星级排名", fee: "公益咨询", status: "工作日可咨询", tags: ["水稻", "病虫害", "公开名录"] },
    { name: "香菇出菇期技术指导", provider: "曾都区食用菌技术服务队", kind: "运营维护技术团队", distance: "6.5km", rating: "4.9（9条）", fee: "首次线上咨询免费", status: "可线上咨询", tags: ["香菇", "出菇管理", "身份已核"] },
  ],
} as const;

type FarmResourceItem = (typeof farmResources)[keyof typeof farmResources][number];

const workspaceMeta: Record<DemoScenario, { fullName: string; shortName: string; type: string; role: string; scope: string; status: string; validity: string }> = {
  "farmer-pending": { fullName: "王建国农户", shortName: "王建国农户", type: "本人农户", role: "本人农户", scope: "随州市", status: "本人声明", validity: "长期有效" },
  "farmer-empty": { fullName: "王建国农户", shortName: "王建国农户", type: "本人农户", role: "本人农户", scope: "随州市", status: "本人声明", validity: "长期有效" },
  "org-admin": { fullName: "湖北随州丰禾农业有限公司", shortName: "随州丰禾农业", type: "农业企业", role: "主体管理员", scope: "曾都区基地", status: "已认证", validity: "长期有效" },
  "org-business": { fullName: "随州菇源农业合作社", shortName: "菇源农业合作社", type: "合作社", role: "业务人员", scope: "厉山镇1号基地", status: "已认证", validity: "至2027-02-28" },
  "org-viewer": { fullName: "随县优农冷链有限公司", shortName: "优农冷链", type: "冷链服务企业", role: "查看人员", scope: "随县冷链点", status: "已认证", validity: "至2026-12-31" },
  "org-invited": { fullName: "随州优鲜农产品有限公司", shortName: "随州优鲜农产品", type: "农业企业", role: "业务人员", scope: "厉山镇1号基地", status: "已认证", validity: "至2027-08-31" },
  "gov-staff": { fullName: "随州市农业农村局", shortName: "随州市农业农村局", type: "政务机构", role: "政务工作人员", scope: "随州市 · 风险与工单专题", status: "机构已开通", validity: "至2027-06-30" },
  "bank-staff": { fullName: "随州农村商业银行厉山支行", shortName: "随州农商行 · 厉山支行", type: "银行机构", role: "银行业务人员", scope: "厉山支行 · 惠农产品/本人意向", status: "机构已开通", validity: "至2027-06-30" },
  "ops-staff": { fullName: "数耒神农码运营中心", shortName: "神农码运营中心", type: "受托运营机构", role: "运营人员", scope: "随州租户 · 审核/数据质量", status: "授权有效", validity: "至2027-03-31" },
};

export default function Prototype() {
  const keyboard = useKeyboard();
  const [view, setView] = useState<View>("home");
  const viewHistory = useRef<View[]>([]);
  const [lastTab, setLastTab] = useState<MainTab>("home");
  const [moduleKey, setModuleKey] = useState<ModuleKey>("farm");
  const [loginOpen, setLoginOpen] = useState(false);
  const [phoneMode, setPhoneMode] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [realNamed, setRealNamed] = useState(false);
  const [hasFarmer, setHasFarmer] = useState(false);
  const [pendingAction, setPendingAction] = useState("");
  const [toast, setToast] = useState("");
  const [farmerStep, setFarmerStep] = useState(1);
  const [demandStep, setDemandStep] = useState(1);
  const [selectedFarmType, setSelectedFarmType] = useState("水稻收割");
  const [selectedFarmResource, setSelectedFarmResource] = useState<{ category: FarmCategory; index: number }>({ category: "农事", index: 0 });
  const [farmManagementTab, setFarmManagementTab] = useState<FarmManagementTab>("demand");
  const [selectedDemandScene, setSelectedDemandScene] = useState<DemandScene>("published");
  const [resourcePublishState, setResourcePublishState] = useState<ResourcePublishState>("已发布");
  const [resourceVersion, setResourceVersion] = useState(3);
  const [resourceSheetOpen, setResourceSheetOpen] = useState(false);
  const [favoriteFarmResource, setFavoriteFarmResource] = useState(false);
  const [selectedTraceBatch, setSelectedTraceBatch] = useState<TraceBatchKey>("mushroom");
  const [orgStep, setOrgStep] = useState<"search" | "create">("search");
  const [farmFilterOpen, setFarmFilterOpen] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);
  const [workspaceSheet, setWorkspaceSheet] = useState<WorkspaceSheet>(null);
  const [membershipStage, setMembershipStage] = useState<MembershipStage>("invite");
  const [memberSetupStep, setMemberSetupStep] = useState(1);
  const [activatedMemberRole, setActivatedMemberRole] = useState<"业务人员" | "查看人员">("业务人员");
  const [activatedMemberCapabilities, setActivatedMemberCapabilities] = useState<string[]>(["生产办理", "农服办理"]);
  const [orgAuthStage, setOrgAuthStage] = useState<OrgAuthStage>("supplement");
  const [farmContactMode, setFarmContactMode] = useState<FarmContactMode>("chat");
  const [selectedBusinessCard, setSelectedBusinessCard] = useState(0);
  const [businessAction, setBusinessAction] = useState<BusinessAction>("cold-demand");
  const [businessFormStep, setBusinessFormStep] = useState(1);
  const [businessRecordState, setBusinessRecordState] = useState<BusinessRecordState>("submitted");
  const [bankIntentState, setBankIntentState] = useState<BankIntentState>("待联系");
  const [governmentWorkOrderState, setGovernmentWorkOrderState] = useState<GovernmentWorkOrderState>("待签收");
  const [operationsTaskState, setOperationsTaskState] = useState<OperationsTaskState>("待签收");
  const [handoverAccepted, setHandoverAccepted] = useState(false);
  const [demoScenario, setDemoScenario] = useState<DemoScenario>("farmer-pending");
  const [traceResult, setTraceResult] = useState<TraceAction>("record");
  const [orgAuthStep, setOrgAuthStep] = useState(1);
  const activeModule = useMemo(() => modules.find((item) => item.key === moduleKey) ?? modules[1], [moduleKey]);
  const isOrgPreview = demoScenario.startsWith("org-");
  const isInstitutionPreview = demoScenario === "gov-staff" || demoScenario === "bank-staff" || demoScenario === "ops-staff";
  const hasWorkspace = hasFarmer || isOrgPreview || isInstitutionPreview;
  const currentWorkspace = workspaceMeta[demoScenario];

  useEffect(() => {
    const scrollViewport = document.querySelector<HTMLElement>(".app-scroll .mobile-scroll");
    if (scrollViewport) scrollViewport.scrollTop = 0;
  }, [view, moduleKey, farmerStep, demandStep, orgStep, orgAuthStep, memberSetupStep]);

  const flash = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 1800);
  };

  const navigate = (next: View, mode: NavigationMode = "push") => {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    keyboard.hide();
    if (next === "home" || next === "code" || next === "mine") setLastTab(next);
    setView((current) => {
      if (current === next) return current;
      if (mode === "reset") viewHistory.current = [];
      else if (mode === "push") viewHistory.current.push(current);
      return next;
    });
  };

  const returnTo = (target: View) => {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    keyboard.hide();
    const targetIndex = viewHistory.current.lastIndexOf(target);
    viewHistory.current = targetIndex >= 0 ? viewHistory.current.slice(0, targetIndex) : [];
    setView(target);
  };

  const openModule = (key: ModuleKey) => {
    setModuleKey(key);
    navigate("module");
  };

  const openBusinessAction = (action: BusinessAction) => {
    setBusinessAction(action);
    setModuleKey(businessActionModule[action]);
    setBusinessFormStep(1);
    if (action === "finance-channel") {
      navigate("business-form");
      return;
    }
    setPendingAction(businessActionLabels[action]);
    if (!loggedIn) {
      setLoginOpen(true);
      return;
    }
    if (!realNamed) {
      navigate("realname");
      return;
    }
    if (!hasWorkspace) {
      navigate("actor");
      return;
    }
    const orgOnly = action === "cold-provider" || action === "trade-demand" || action === "trade-delivery" || action === "trade-receipt";
    if (orgOnly && !isOrgPreview) {
      navigate("business-gate");
      return;
    }
    navigate("business-form");
  };

  const openBusinessManagement = (key: Exclude<ModuleKey, "trace" | "farm">) => {
    setModuleKey(key);
    const label = `查看我的${modules.find((item) => item.key === key)?.name ?? "业务"}`;
    setPendingAction(label);
    if (!loggedIn) {
      setLoginOpen(true);
      return;
    }
    navigate("business-management");
  };

  const requireLogin = (action: string) => {
    setPendingAction(action);
    if (!loggedIn) {
      setLoginOpen(true);
      return;
    }
    if (!realNamed) {
      navigate("realname");
      return;
    }
    if (!hasWorkspace) {
      navigate("actor");
      return;
    }
    if (action.includes("农事")) {
      setDemandStep(1);
      navigate("farm-demand");
      return;
    }
    if (action.includes("服务提供方")) {
      navigate("provider-apply");
      return;
    }
    flash(`${action}需要补充对应业务能力，本原型先展示门槛说明`);
  };

  const finishLogin = () => {
    keyboard.hide();
    setLoggedIn(true);
    setLoginOpen(false);
    setPhoneMode(false);
    if (pendingAction === "查看我的农服") {
      setPendingAction("");
      setFarmManagementTab("demand");
      navigate("farm-management");
    } else if (pendingAction === "收藏农服资源") {
      setPendingAction("");
      setFavoriteFarmResource(true);
      flash("已收藏，可在“我的”统一查看");
      navigate("farm-service-detail");
    } else if (pendingAction === "联系农服服务方") {
      setPendingAction("");
      setFarmContactMode("callback");
      navigate("farm-contact");
    } else if (pendingAction === "沟通农服服务方") {
      setPendingAction("");
      setFarmContactMode("chat");
      navigate("farm-contact");
    } else if (pendingAction.startsWith("查看我的码上") || pendingAction === "查看我的惠农服务") {
      setPendingAction("");
      navigate("business-management");
    } else if (pendingAction) navigate("realname");
    else navigate("mine");
  };

  const resumeAction = () => {
    if (pendingAction.includes("农事")) {
      setDemandStep(1);
      navigate("farm-demand");
    } else if (pendingAction.includes("服务提供方")) {
      navigate("provider-apply");
    } else if ((Object.values(businessActionLabels) as string[]).includes(pendingAction)) {
      const action = (Object.keys(businessActionLabels) as BusinessAction[]).find((key) => businessActionLabels[key] === pendingAction);
      if (action) {
        setBusinessAction(action);
        setModuleKey(businessActionModule[action]);
        const orgOnly = action === "cold-provider" || action === "trade-demand" || action === "trade-delivery" || action === "trade-receipt";
        navigate(orgOnly && !isOrgPreview ? "business-gate" : "business-form");
      }
    } else {
      navigate("workbench");
    }
  };

  const back = () => {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    keyboard.hide();
    const previous = viewHistory.current.pop();
    if (previous) setView(previous);
    else setView(lastTab === view ? "home" : lastTab);
  };

  const showNav = view === "home" || view === "code" || view === "mine" || view === "workbench";

  return (
    <div className="sn-app" data-view={view}>
      <MobileScroll className={`app-scroll ${showNav ? "has-nav" : ""}`}>
        {view === "home" && (
          <PublicHome
            loggedIn={loggedIn}
            hasFarmer={hasWorkspace}
            workspaceType={currentWorkspace.type}
            workspaceName={currentWorkspace.shortName}
            hasPending={demoScenario !== "farmer-empty"}
            membershipStage={membershipStage}
            openModule={openModule}
            onStart={() => (loggedIn ? navigate("actor") : setLoginOpen(true))}
            onWorkbench={() => navigate("workbench")}
            onMembershipNotice={() => membershipStage === "invite" ? setWorkspaceSheet("invite") : navigate("membership-pending")}
            flash={flash}
          />
        )}
        {view === "code" && (
          <CodeCenter
            loggedIn={loggedIn}
            hasFarmer={hasWorkspace}
            demoScenario={demoScenario}
            onLogin={() => {
              setPendingAction("");
              setLoginOpen(true);
            }}
            onSetup={() => navigate("actor")}
            flash={flash}
          />
        )}
        {view === "mine" && (
          <MinePage
            loggedIn={loggedIn}
            hasWorkspace={hasWorkspace}
            hasPersonalFarmer={hasFarmer || isOrgPreview || isInstitutionPreview}
            demoScenario={demoScenario}
            onLogin={() => {
              setPendingAction("");
              setLoginOpen(true);
            }}
            onActor={() => navigate("actor")}
            onWorkbench={() => navigate("workbench")}
            onSpaces={() => navigate("workspace-center")}
            onProgress={() => navigate("org-auth-progress")}
            onDemo={() => setDemoOpen(true)}
            flash={flash}
          />
        )}
        {view === "module" && (
          activeModule.key === "farm" ? (
            <FarmServiceHome
              onBack={back}
              onCustomDemand={() => requireLogin("发布农事定制需求")}
              onProviderApply={() => requireLogin("申请成为农服服务提供方")}
              onMyFarmService={() => loggedIn ? (setFarmManagementTab("demand"), navigate("farm-management")) : (setPendingAction("查看我的农服"), setLoginOpen(true))}
              onResource={(category, index) => { setSelectedFarmResource({ category, index }); navigate("farm-service-detail"); }}
              onFilter={() => setFarmFilterOpen(true)}
              flash={flash}
            />
          ) : activeModule.key === "trace" ? (
            <ModulePage
              module={activeModule}
              onBack={back}
              onPrimary={() => {
                if (activeModule.key === "trace") navigate("code");
                else flash(`${activeModule.primary}：公开浏览无需登录`);
              }}
              onSecondary={() => requireLogin(activeModule.secondary)}
              flash={flash}
            />
          ) : (
            <BusinessModuleHome
              module={activeModule as ModuleItem & { key: Exclude<ModuleKey, "trace" | "farm"> }}
              onBack={back}
              onDetail={(index) => { setSelectedBusinessCard(index); navigate("business-detail"); }}
              onMap={() => navigate("cold-map")}
              onPrimary={() => {
                if (activeModule.key === "cold") navigate("cold-map");
                if (activeModule.key === "brand") openBusinessAction("brand-create");
                if (activeModule.key === "trade") openBusinessAction("trade-supply");
                if (activeModule.key === "finance") { setSelectedBusinessCard(0); navigate("business-detail"); }
              }}
              onSecondary={() => {
                if (activeModule.key === "cold") openBusinessAction("cold-demand");
                if (activeModule.key === "brand") openBusinessAction("brand-apply");
                if (activeModule.key === "trade") openBusinessAction("trade-demand");
                if (activeModule.key === "finance") openBusinessAction("finance-intent");
              }}
              onManage={() => openBusinessManagement(activeModule.key as Exclude<ModuleKey, "trace" | "farm">)}
              onProvider={() => openBusinessAction("cold-provider")}
              flash={flash}
            />
          )
        )}
        {view === "cold-map" && <ColdChainMap onBack={back} onDetail={(index) => { setModuleKey("cold"); setSelectedBusinessCard(index); navigate("business-detail"); }} onDemand={() => openBusinessAction("cold-demand")} flash={flash} />}
        {view === "business-detail" && <BusinessPublicDetail moduleKey={moduleKey as Exclude<ModuleKey, "trace" | "farm">} cardIndex={selectedBusinessCard} onBack={back} onProducts={() => navigate("brand-products")} onPrimary={() => {
          if (moduleKey === "cold") openBusinessAction("cold-demand");
          if (moduleKey === "brand") openBusinessAction("brand-apply");
          if (moduleKey === "trade") openBusinessAction("trade-intent");
          if (moduleKey === "finance") openBusinessAction("finance-channel");
        }} onSecondary={() => {
          if (moduleKey === "cold") flash("已发送限时联系请求；精确位置与手机号不会公开展示");
          if (moduleKey === "brand") navigate("brand-products");
          if (moduleKey === "trade") flash("已收藏供需信息，可在我的交易查看");
          if (moduleKey === "finance") openBusinessAction("finance-intent");
        }} flash={flash} />}
        {view === "brand-products" && <BrandAuthorizedProducts onBack={back} onTrace={() => { setSelectedTraceBatch("mushroom"); navigate("trace-public"); }} onApply={() => openBusinessAction("brand-apply")} flash={flash} />}
        {view === "business-gate" && <BusinessEligibilityGate action={businessAction} onBack={back} onCreateOrg={() => { setOrgStep("search"); navigate("org-setup"); }} onSpaces={() => navigate("workspace-center")} />}
        {view === "business-form" && <BusinessActionForm action={businessAction} step={businessFormStep} subjectName={currentWorkspace.shortName} onBack={() => businessFormStep > 1 ? setBusinessFormStep(businessFormStep - 1) : back()} onNext={() => {
          if (businessFormStep < actionStepCount[businessAction]) setBusinessFormStep(businessFormStep + 1);
          else {
            if (businessAction === "finance-channel") {
              flash("演示：已确认银行官方渠道，真实环境将拉起银行自营小程序");
              returnTo("business-detail");
              return;
            }
            setBusinessRecordState("submitted");
            setPendingAction("");
            navigate("business-record");
          }
        }} flash={flash} />}
        {view === "business-management" && <BusinessManagement moduleKey={moduleKey as Exclude<ModuleKey, "trace" | "farm">} onBack={back} onRecord={(action, state) => { setBusinessAction(action); setBusinessRecordState(state); navigate("business-record"); }} onNew={openBusinessAction} flash={flash} />}
        {view === "business-record" && <BusinessRecordDetail action={businessAction} state={businessRecordState} onBack={back} onAdvance={() => setBusinessRecordState(businessRecordState === "submitted" ? "responded" : "confirmed")} onTrace={() => navigate("trace-cycle-detail")} onManage={() => returnTo("business-management")} onAction={openBusinessAction} flash={flash} />}
        {view === "realname" && <RealNamePage action={pendingAction} onBack={back} onNext={() => { setRealNamed(true); navigate("actor"); }} />}
        {view === "actor" && (
          <ActorPage
            action={pendingAction}
            onBack={back}
            onFarmer={() => { setFarmerStep(1); navigate("farmer-profile"); }}
            onOrg={() => { setOrgStep("search"); navigate("org-setup"); }}
            onJoin={() => navigate("join-org")}
            onInstitution={() => navigate("institution")}
          />
        )}
        {view === "farmer-profile" && (
          <FarmerProfile
            step={farmerStep}
            onBack={() => (farmerStep > 1 ? setFarmerStep(farmerStep - 1) : back())}
            onNext={() => {
              if (farmerStep < 3) setFarmerStep(farmerStep + 1);
              else {
                setHasFarmer(true);
                navigate("farmer-success");
              }
            }}
          />
        )}
        {view === "farmer-success" && <FarmerSuccess action={pendingAction} onResume={resumeAction} onWorkbench={() => navigate("workbench")} />}
        {view === "farm-demand" && (
          <FarmDemand
            step={demandStep}
            selectedType={selectedFarmType}
            onSelectType={setSelectedFarmType}
            onBack={() => (demandStep > 1 ? setDemandStep(demandStep - 1) : back())}
            onNext={() => {
              if (demandStep < 4) setDemandStep(demandStep + 1);
              else {
                setPendingAction("");
                setSelectedDemandScene("published");
                flash("需求已发布，可在“我的农服”继续查看");
                navigate("farm-demand-detail");
              }
            }}
          />
        )}
        {view === "farm-service-detail" && <FarmServiceDetail resource={farmResources[selectedFarmResource.category][selectedFarmResource.index]} category={selectedFarmResource.category} favorite={favoriteFarmResource} onBack={back} onFavorite={() => loggedIn ? setFavoriteFarmResource(!favoriteFarmResource) : (setPendingAction("收藏农服资源"), setLoginOpen(true))} onChat={() => loggedIn ? (setFarmContactMode("chat"), navigate("farm-contact")) : (setPendingAction("沟通农服服务方"), setLoginOpen(true))} onContact={() => loggedIn ? (setFarmContactMode("callback"), navigate("farm-contact")) : (setPendingAction("联系农服服务方"), setLoginOpen(true))} flash={flash} />}
        {view === "farm-contact" && <FarmServiceContact mode={farmContactMode} resource={farmResources[selectedFarmResource.category][selectedFarmResource.index]} onBack={back} flash={flash} />}
        {view === "farm-management" && <FarmServiceManagement tab={farmManagementTab} resourceState={resourcePublishState} onTab={setFarmManagementTab} onBack={back} onDemand={(scene) => { setSelectedDemandScene(scene); navigate("farm-demand-detail"); }} onResource={() => navigate("farm-resource-detail")} onHome={() => { setModuleKey("farm"); navigate("module"); }} flash={flash} />}
        {view === "farm-demand-detail" && <FarmDemandDetail scene={selectedDemandScene} onBack={back} onEdit={() => { setDemandStep(3); navigate("farm-demand"); }} onConfirm={() => { setSelectedDemandScene("completed"); flash("已确认服务结果，并写入关联生产周期"); }} onTrace={() => navigate("trace-cycle-detail")} flash={flash} />}
        {view === "farm-resource-detail" && <FarmResourceDetail state={resourcePublishState} version={resourceVersion} onBack={back} onEdit={() => navigate("farm-resource-edit")} onState={() => setResourceSheetOpen(true)} flash={flash} />}
        {view === "farm-resource-edit" && <FarmResourceEdit version={resourceVersion} onBack={back} onSave={() => { setResourceVersion(resourceVersion + 1); setResourcePublishState("已发布"); flash(`资源 V${resourceVersion + 1} 已发布，旧版本继续保留`); back(); }} />}
        {view === "workbench" && (demoScenario === "gov-staff" ? (
          <GovernmentWorkbench onBack={back} onDemo={() => setDemoOpen(true)} onArea={() => navigate("gov-area-overview")} onOrders={() => navigate("gov-work-orders")} onPriority={() => navigate("gov-work-order-detail")} flash={flash} />
        ) : demoScenario === "bank-staff" ? (
          <BankWorkbench onBack={back} onDemo={() => setDemoOpen(true)} onIntents={() => navigate("bank-intents")} onPriority={() => navigate("bank-intent-detail")} flash={flash} />
        ) : demoScenario === "ops-staff" ? (
          <OperationsWorkbench onBack={back} onDemo={() => setDemoOpen(true)} onTasks={() => navigate("ops-tasks")} onPriority={() => navigate("ops-task-detail")} onReview={() => navigate("ops-formal-review")} onShift={() => navigate("ops-shift-handover")} flash={flash} />
        ) : isOrgPreview ? (
          <OrganizationWorkbench
            scenario={demoScenario}
            memberCapabilities={activatedMemberCapabilities}
            onBack={back}
            onRoles={() => navigate("role-management")}
            onScan={() => navigate("code")}
            onTrace={() => navigate("trace-center")}
            onFarm={() => { setModuleKey("farm"); navigate("module"); }}
            onBrand={() => { setModuleKey("brand"); navigate("module"); }}
            onTrade={() => { setModuleKey("trade"); navigate("module"); }}
            onDemo={() => setDemoOpen(true)}
            flash={flash}
          />
        ) : (
          <FarmerWorkbench
            hasPending={demoScenario !== "farmer-empty"}
            onBack={back}
            openModule={openModule}
            onDemand={() => requireLogin("发布农事定制需求")}
            onFarmManagement={() => { setFarmManagementTab("demand"); navigate("farm-management"); }}
            onProduction={() => navigate("trace-center")}
            onPendingService={() => { setSelectedDemandScene("confirm"); navigate("farm-demand-detail"); }}
            onBatches={() => navigate("trace-batches")}
            onTrace={(action) => {
              if (action === "start") navigate("trace-start");
              if (action === "record") navigate("trace-record");
              if (action === "harvest") navigate("trace-harvest");
            }}
            onDemo={() => setDemoOpen(true)}
            flash={flash}
          />
        ))}
        {view === "org-setup" && (
          <OrgSetup
            step={orgStep}
            onBack={() => (orgStep === "create" ? setOrgStep("search") : back())}
            onNext={() => (orgStep === "search" ? setOrgStep("create") : navigate("restricted-space"))}
          />
        )}
        {view === "join-org" && <JoinOrg onBack={back} onSubmit={() => { flash("加入申请已提交，等待组织管理员确认"); navigate("mine"); }} />}
        {view === "institution" && <InstitutionOpen onBack={back} />}
        {view === "restricted-space" && <RestrictedSpace onHome={() => navigate("mine")} onStartAuth={() => { setOrgAuthStep(1); setOrgAuthStage("supplement"); navigate("org-auth"); }} flash={flash} />}
        {view === "provider-apply" && <ProviderApply onBack={back} onContinue={() => flash("已生成服务能力材料清单，可在认证后继续")} />}
        {view === "trace-start" && <TraceStartPage onBack={back} onSubmit={() => { setTraceResult("start"); navigate("trace-result"); }} />}
        {view === "trace-record" && <TraceRecordPage onBack={back} onSubmit={() => { setTraceResult("record"); navigate("trace-result"); }} />}
        {view === "trace-harvest" && <TraceHarvestPage onBack={back} onSubmit={() => { setTraceResult("harvest"); navigate("trace-result"); }} />}
        {view === "trace-result" && <TraceResultPage kind={traceResult} onWorkbench={() => navigate("workbench")} onContinue={() => navigate(traceResult === "harvest" ? "trace-batch-detail" : "trace-cycle-detail")} />}
        {view === "trace-center" && <TraceCenter onBack={back} onCycle={() => navigate("trace-cycle-detail")} onBatches={() => navigate("trace-batches")} onTrace={(action) => navigate(action === "start" ? "trace-start" : action === "record" ? "trace-record" : "trace-harvest")} />}
        {view === "trace-cycle-detail" && <TraceCycleDetail onBack={back} onRecord={() => navigate("trace-record")} onHarvest={() => navigate("trace-harvest")} onBatches={() => navigate("trace-batches")} onFarmService={() => { setSelectedDemandScene("completed"); navigate("farm-demand-detail"); }} />}
        {view === "trace-batches" && <TraceBatches onBack={back} onBatch={(batch) => { setSelectedTraceBatch(batch); navigate("trace-batch-detail"); }} />}
        {view === "trace-batch-detail" && <TraceBatchDetail batch={selectedTraceBatch} onBack={back} onPublic={() => navigate("trace-public")} flash={flash} />}
        {view === "trace-public" && <TracePublic batch={selectedTraceBatch} onBack={back} flash={flash} />}
        {view === "org-auth" && <OrganizationAuth step={orgAuthStep} onBack={() => orgAuthStep > 1 ? setOrgAuthStep(orgAuthStep - 1) : back()} onCancel={() => returnTo("restricted-space")} onNext={() => {
          if (orgAuthStep < 4) setOrgAuthStep(orgAuthStep + 1);
          else navigate("org-auth-progress");
        }} />}
        {view === "org-auth-progress" && <OrganizationAuthProgress stage={orgAuthStage} onBack={back} onSupplement={() => navigate("org-auth-supplement")} onRestricted={() => returnTo("restricted-space")} onApproved={() => setOrgAuthStage("approved")} onWorkbench={() => { setDemoScenario("org-admin"); setLoggedIn(true); setRealNamed(true); setHasFarmer(false); navigate("workbench"); }} flash={flash} />}
        {view === "org-auth-supplement" && <OrganizationAuthSupplement onBack={back} onSubmit={() => { setOrgAuthStage("review"); flash("补件材料已提交，已进入人工复核"); back(); }} flash={flash} />}
        {view === "role-management" && <RoleManagement scenario={demoScenario} onBack={back} flash={flash} />}
        {view === "workspace-center" && (
          <WorkspaceCenter
            current={demoScenario}
            membershipStage={membershipStage}
            activatedRole={activatedMemberRole}
            activatedCapabilities={activatedMemberCapabilities}
            onBack={back}
            onSelect={(scenario) => {
              setDemoScenario(scenario);
              setLoggedIn(true);
              setRealNamed(true);
              setHasFarmer(scenario.startsWith("farmer-"));
              navigate("workbench");
            }}
            onCreate={() => { setOrgStep("search"); navigate("org-setup"); }}
            onJoin={() => navigate("join-org")}
            onInstitution={() => navigate("institution")}
            onInvite={() => setWorkspaceSheet("invite")}
            onPending={() => navigate("membership-pending")}
            onProduct={() => setWorkspaceSheet("product")}
            flash={flash}
          />
        )}
        {view === "membership-pending" && <MembershipPending onBack={back} onAdminDemo={() => { setMemberSetupStep(1); navigate("member-permission-setup"); }} flash={flash} />}
        {view === "member-permission-setup" && <MemberPermissionSetup step={memberSetupStep} onBack={() => memberSetupStep > 1 ? setMemberSetupStep(memberSetupStep - 1) : back()} onNext={() => setMemberSetupStep(memberSetupStep + 1)} onActivate={(role, capabilities) => { setActivatedMemberRole(role); setActivatedMemberCapabilities(capabilities); setMembershipStage("active"); navigate("member-active-result"); }} flash={flash} />}
        {view === "member-active-result" && <MemberActiveResult role={activatedMemberRole} capabilities={activatedMemberCapabilities} onBack={() => returnTo("workspace-center")} onEnter={() => { setDemoScenario("org-invited"); setLoggedIn(true); setRealNamed(true); setHasFarmer(false); navigate("workbench"); }} onSpaces={() => returnTo("workspace-center")} />}
        {view === "bank-intents" && <BankIntentList onBack={back} onDetail={() => navigate("bank-intent-detail")} />}
        {view === "bank-intent-detail" && <BankIntentDetail state={bankIntentState} onBack={back} onReceive={() => { setBankIntentState("待联系"); flash("意向已接收并分配给你"); }} onContact={() => navigate("bank-contact")} onPc={() => flash("请在银行 PC 端按本次有效授权查看数据快照；每次查看都会记录审计日志")} />}
        {view === "bank-contact" && <BankContactPage onBack={back} onSubmit={() => { setBankIntentState("已联系"); flash("联系结果已保存，并同步用户可见状态"); returnTo("bank-intent-detail"); }} />}
        {view === "gov-area-overview" && <GovernmentAreaOverview onBack={back} onOrders={() => navigate("gov-work-orders")} flash={flash} />}
        {view === "gov-work-orders" && <GovernmentWorkOrders state={governmentWorkOrderState} onBack={back} onDetail={() => navigate("gov-work-order-detail")} />}
        {view === "gov-work-order-detail" && <GovernmentWorkOrderDetail state={governmentWorkOrderState} onBack={back} onAdvance={() => { setGovernmentWorkOrderState(governmentWorkOrderState === "待签收" ? "处理中" : "待复核"); flash(governmentWorkOrderState === "待签收" ? "工单已签收，进入处理中" : "处置事实已提交复核"); }} flash={flash} />}
        {view === "ops-tasks" && <OperationsTaskList state={operationsTaskState} onBack={back} onDetail={() => navigate("ops-task-detail")} onReview={() => navigate("ops-formal-review")} />}
        {view === "ops-task-detail" && <OperationsTaskDetail state={operationsTaskState} onBack={back} onAdvance={() => { setOperationsTaskState(operationsTaskState === "待签收" ? "处理中" : "待验证"); flash(operationsTaskState === "待签收" ? "运营工单已签收" : "已标记恢复，等待独立验证"); }} flash={flash} />}
        {view === "ops-formal-review" && <OperationsFormalReview onBack={back} flash={flash} />}
        {view === "ops-shift-handover" && <OperationsShiftHandover accepted={handoverAccepted} onBack={back} onAccept={() => { setHandoverAccepted(true); flash("2项未结事项已逐项接收"); }} />}
      </MobileScroll>

      {showNav && <BottomNav active={view === "workbench" ? "mine" : (view as MainTab)} onNavigate={(next) => navigate(next, "reset")} />}

      <BottomSheet
        open={loginOpen}
        onOpenChange={(open) => {
          setLoginOpen(open);
          if (!open) {
            keyboard.hide();
            setPhoneMode(false);
          }
        }}
        title={pendingAction ? `登录后继续${pendingAction}` : "登录神农码"}
        description="登录只确认账号，不会自动认证为农户或企业。"
        snap={0.58}
      >
        <div className="login-sheet">
          {!phoneMode ? (
            <>
              <button className="primary-button wechat" onClick={finishLogin}><MobileIcon /> 微信快捷登录</button>
              <button className="secondary-button" onClick={() => setPhoneMode(true)}><IdCardIcon /> 手机号验证码登录</button>
              <button className="text-button" onClick={() => setLoginOpen(false)}>暂不登录，继续浏览</button>
            </>
          ) : (
            <>
              <label className="sheet-field"><span>手机号</span><KeyboardInput inputMode="tel" placeholder="请输入 11 位手机号" /></label>
              <div className="code-field"><label className="sheet-field"><span>验证码</span><KeyboardInput inputMode="numeric" placeholder="请输入验证码" /></label><button onClick={() => flash("验证码已发送")}>获取验证码</button></div>
              <button className="primary-button" onClick={finishLogin}>登录并继续</button>
              <button className="text-button" onClick={() => { keyboard.hide(); setPhoneMode(false); }}>返回微信登录</button>
            </>
          )}
          <p className="privacy-copy">登录即表示你已阅读并同意《用户协议》和《隐私政策》</p>
        </div>
      </BottomSheet>

      <BottomSheet open={farmFilterOpen} onOpenChange={setFarmFilterOpen} title="筛选附近服务" description="费用为参考区间，评价只统计已确认履约样本。" snap={0.67}>
        <FilterSheet onApply={() => { setFarmFilterOpen(false); flash("已按 10km、4.5分以上和参考费用筛选"); }} />
      </BottomSheet>

      <BottomSheet open={resourceSheetOpen} onOpenChange={setResourceSheetOpen} title="调整资源展示状态" description="下架不会删除历史版本和已被需求引用的快照。" snap={0.48}>
        <div className="resource-state-sheet">
          <button onClick={() => { setResourcePublishState("已暂停"); setResourceSheetOpen(false); flash("资源已暂停，公众侧不再参与匹配"); }}><ClockIcon /><span><strong>暂停接洽</strong><small>临时不可服务，恢复后沿用当前版本</small></span><ChevronRightIcon /></button>
          <button onClick={() => { setResourcePublishState("已下架"); setResourceSheetOpen(false); flash("资源已下架，历史引用与审计记录已保留"); }}><LockClosedIcon /><span><strong>下架资源</strong><small>不再公开展示，不能物理删除历史记录</small></span><ChevronRightIcon /></button>
          {resourcePublishState !== "已发布" && <button onClick={() => { setResourcePublishState("已发布"); setResourceSheetOpen(false); flash("资源已恢复公开展示"); }}><ReloadIcon /><span><strong>恢复上架</strong><small>恢复前会再次检查能力材料有效期</small></span><ChevronRightIcon /></button>}
        </div>
      </BottomSheet>

      <BottomSheet open={demoOpen} onOpenChange={setDemoOpen} title="原型演示模式" description="仅用于原型评审，不是生产功能，也不是真实主体/角色切换。" snap={0.72}>
        <DemoScenarioSheet
          current={demoScenario}
          onSelect={(scenario) => {
            setDemoScenario(scenario);
            setLoggedIn(true);
            setRealNamed(true);
            setHasFarmer(scenario.startsWith("farmer-"));
            setDemoOpen(false);
            navigate("workbench");
          }}
        />
      </BottomSheet>

      <BottomSheet open={workspaceSheet === "invite"} onOpenChange={(open) => !open && setWorkspaceSheet(null)} title="组织邀请" description="接受邀请只建立待配置关系，管理员配置角色、数据范围和有效期后才可进入。" snap={0.55}>
        <WorkspaceInviteSheet onClose={() => setWorkspaceSheet(null)} onAccept={() => { setWorkspaceSheet(null); setMembershipStage("pending"); navigate("membership-pending"); }} flash={flash} />
      </BottomSheet>

      <BottomSheet open={workspaceSheet === "product"} onOpenChange={(open) => !open && setWorkspaceSheet(null)} title="关联产品与数据授权" description="统一账号可登录，不代表业务数据已经自动共享。" snap={0.68}>
        <ProductAccessSheet onClose={() => setWorkspaceSheet(null)} flash={flash} />
      </BottomSheet>

      {toast && <div className="toast"><CheckCircledIcon />{toast}</div>}
    </div>
  );
}

function PublicHome({
  loggedIn,
  hasFarmer,
  workspaceType,
  workspaceName,
  hasPending,
  membershipStage,
  openModule,
  onStart,
  onWorkbench,
  onMembershipNotice,
  flash,
}: {
  loggedIn: boolean;
  hasFarmer: boolean;
  workspaceType: string;
  workspaceName: string;
  hasPending: boolean;
  membershipStage: MembershipStage;
  openModule: (key: ModuleKey) => void;
  onStart: () => void;
  onWorkbench: () => void;
  onMembershipNotice: () => void;
  flash: (message: string) => void;
}) {
  const workspacePriority = workspaceType === "政务机构" ? "最高优先级：签收辖区核查工单" : workspaceType === "银行机构" ? "最高优先级：联系已授权服务意向" : workspaceType === "受托运营机构" ? "最高优先级：处理形式审核待办" : workspaceType === "本人农户" ? "最高优先级：补充采收记录" : "最高优先级：完善移动采集记录";
  return (
    <main className="public-home">
      <section className="public-hero">
        <img className="hero-landscape" src="/assets/shennong/hero-landscape.png" alt="随州香稻与香菇产业山水" draggable={false} />
        <div className="hero-wash" />
        <div className="home-topbar">
          <button className="region-button" onClick={() => flash("随州试点期间默认服务区域为随州市")}><SewingPinIcon />随州市<ChevronRightIcon /></button>
          <button className={`message-button ${loggedIn && membershipStage !== "active" ? "has-unread" : ""}`} aria-label="消息通知" onClick={loggedIn && membershipStage !== "active" ? onMembershipNotice : () => flash("暂无新消息")}><BellIcon /></button>
        </div>
        <label className="hero-search"><MagnifyingGlassIcon /><KeyboardInput aria-label="全局搜索" placeholder="搜农服、冷链、品牌、供需、产品" /><button type="button" aria-label="语音搜索" onClick={() => flash("请说：我要找收割机")}><PaperPlaneIcon /></button></label>
        <div className="hero-brand"><span>随州农业数字化服务平台</span><h1>神农码</h1><p>农产溯源 · 一码通行</p></div>
        <img className="hero-mascot" src="/assets/shennong/mascot.png" alt="神农码吉祥物" draggable={false} />
      </section>

      <section className="paper-body">
        <button className="notice-ribbon" onClick={() => flash("通知详情：随州香菇冷链资源更新")}><BellIcon /><span><b>服务通知</b> 随州香菇冷链资源名录已更新</span><ChevronRightIcon /></button>

        {loggedIn && membershipStage !== "active" && (
          <button className={`home-membership-notice ${membershipStage}`} onClick={onMembershipNotice}>
            <span className="home-membership-icon">{membershipStage === "invite" ? <BellIcon /> : <ClockIcon />}</span>
            <span>
              <small>{membershipStage === "invite" ? "组织邀请 · 3天后失效" : "成员关系 · 等待管理员配置"}</small>
              <strong>随州优鲜农产品有限公司</strong>
              <em>{membershipStage === "invite" ? "邀请你加入并担任业务人员" : "角色、能力范围与有效期未配置前不可进入"}</em>
            </span>
            <ChevronRightIcon />
          </button>
        )}

        <div className="section-heading"><div><span>六个码上</span><small>公开浏览不需要登录</small></div></div>
        <div className="module-grid">
          {modules.map(({ key, name, short, icon: Icon, tone }) => (
            <button key={key} className="module-entry" onClick={() => openModule(key)}>
              <span className={`module-medallion ${tone}`}><Icon /></span>
              <strong>{name}</strong><small>{short}</small>
            </button>
          ))}
        </div>

        {loggedIn && (
          <button className="workspace-lite" onClick={hasFarmer ? onWorkbench : onStart}>
            <span className="workspace-icon"><DashboardIcon /></span>
            <span>
              <small>{hasFarmer ? `当前工作空间 · ${workspaceType}` : "已登录，尚未建立业务主体"}</small>
              <strong>{hasFarmer ? (hasPending ? `${workspaceName} · 今日待办 2 项` : `${workspaceName} · 工作台`) : "开始使用神农码"}</strong>
              <em>{hasFarmer ? (hasPending ? workspacePriority : "今天没有必须处理的事情") : "建立农户档案、创建或加入组织"}</em>
            </span>
            <ChevronRightIcon />
          </button>
        )}

        <div className="section-heading recommendation-heading"><div><span>政府推荐服务</span><small>责任单位与有效期清晰可查</small></div><button onClick={() => flash("查看全部政府推荐")}>更多<ChevronRightIcon /></button></div>
        <button className="gov-recommendation" onClick={() => openModule("farm")}>
          <div className="gov-tag"><StarIcon />农业生产应急服务</div>
          <strong>水稻机械收割服务名录</strong>
          <p>依据随州市农机应急调度公开名录，面向随州市香稻种植户。</p>
          <dl><div><dt>推荐单位</dt><dd>随州市农业农村局</dd></div><div><dt>适用区域</dt><dd>随州市</dd></div><div><dt>有效期</dt><dd>至 2026-10-31</dd></div></dl>
          <small>来源：农业生产应急调度 · 2026-08-13 更新</small>
        </button>

        <div className="section-heading"><div><span>热门与附近</span><small>地图和列表均可查看</small></div><button onClick={() => flash("已切换到地图查看")}><GlobeIcon />地图</button></div>
        <div className="nearby-list">
          <button onClick={() => openModule("farm")}><span className="nearby-icon farm"><BackpackIcon /></span><span><strong>附近水稻收割服务</strong><small>曾都区 · 6 家已核验主体可联系</small><em>2.8km · 2026-08-13 更新</em></span><ChevronRightIcon /></button>
          <button onClick={() => openModule("cold")}><span className="nearby-icon cold"><CubeIcon /></span><span><strong>附近香菇冷链资源</strong><small>冷库、预冷与冷藏运输</small><em>3.2km · 能力以服务方更新为准</em></span><ChevronRightIcon /></button>
        </div>

        <div className="section-heading"><div><span>随州产业专区</span><small>一期试点产业</small></div></div>
        <div className="industry-grid">
          <button onClick={() => flash("进入随州香菇产业专区")}><div className="industry-photo mushroom" /><span><strong>随州香菇</strong><small>品牌 · 冷链 · 追溯</small></span><ChevronRightIcon /></button>
          <button onClick={() => flash("进入随州香稻产业专区")}><div className="industry-photo rice" /><span><strong>随州香稻</strong><small>生产 · 农服 · 供需</small></span><ChevronRightIcon /></button>
        </div>

        <p className="platform-footnote">随州市农业农村局指导 · 公开信息以责任主体最新发布为准</p>
      </section>
    </main>
  );
}

function CodeCenter({ loggedIn, hasFarmer, demoScenario, onLogin, onSetup, flash }: { loggedIn: boolean; hasFarmer: boolean; demoScenario: DemoScenario; onLogin: () => void; onSetup: () => void; flash: (message: string) => void }) {
  const managedPreview = demoScenario.startsWith("org-") || demoScenario === "gov-staff" || demoScenario === "bank-staff" || demoScenario === "ops-staff";
  const subjectName = workspaceMeta[demoScenario].shortName;
  const subjectState = managedPreview ? `${workspaceMeta[demoScenario].status} · ${workspaceMeta[demoScenario].role}权限有效` : "本人声明 · 待经营核验";
  return (
    <main className="code-page">
      <header className="plain-title"><span /><strong>神农码</strong><button aria-label="码使用说明" onClick={() => flash("主体身份码、追溯码和一次性确认码用途不同")}><InfoCircledIcon /></button></header>
      {!loggedIn || !hasFarmer ? (
        <>
          <section className="scan-hero">
            <img src="/assets/shennong/mascot.png" alt="神农码吉祥物" draggable={false} />
            <span>公众扫码服务</span><h1>扫一扫神农码</h1><p>查询主体公开信息、产品/批次追溯或进入一次性业务确认</p>
            <button className="primary-button" onClick={() => flash("已打开扫码入口")}><CameraIcon />扫一扫</button>
            <div><button onClick={() => flash("已打开相册识别")}><FileTextIcon />相册识别</button><button onClick={() => flash("请输入码编号")}><IdCardIcon />手动输入</button></div>
          </section>
          <section className="page-card recent-scan"><div className="card-title"><strong>最近扫码</strong><small>保存在本机</small></div><div className="empty-line"><ClockIcon /><span>暂无扫码记录<small>登录后可同步非敏感记录</small></span></div></section>
          <button className="setup-code-card" onClick={loggedIn ? onSetup : onLogin}><LockClosedIcon /><span><strong>{loggedIn ? "建立业务主体后查看身份码" : "登录后查看我的身份码"}</strong><small>登录不等于主体认证，码状态会实时校验</small></span><ChevronRightIcon /></button>
        </>
      ) : (
        <section className="identity-code-wrap">
          <div className="current-subject"><span><small>当前工作空间</small><strong>{subjectName}</strong><em>{subjectState}</em></span><button onClick={() => flash("生产版本只显示账号真实加入且仍有效的工作空间")}>切换</button></div>
          <div className="code-type-tabs"><button className="active">主体身份码</button><button onClick={() => flash("暂无可管理的产品/批次码")}>产品/批次码</button><button onClick={() => flash("暂无待确认业务")}>一次性确认</button></div>
          <div className="identity-card">
            <div className="seal-title">我的神农码</div>
            <img src="/assets/shennong/subject-qr.png" alt={`${subjectName}主体身份二维码`} draggable={false} />
            <strong>{subjectName} · 主体身份码</strong><span className="valid-state"><CheckCircledIcon />当前有效</span>
            <p>用于识别主体公开身份，不代表产品质量合格、全部能力有效或持码人有权签字。</p>
          </div>
          <div className="code-actions"><button onClick={() => flash("二维码已保存，扫码时仍校验最新状态")}><FileTextIcon />保存</button><button onClick={() => flash("已生成安全分享卡片")}><Share1Icon />分享</button><button onClick={() => flash("主体码已刷新")}><ReloadIcon />刷新</button></div>
          <section className="page-card code-history"><div className="card-title"><strong>最近使用</strong><small>只显示当前主体</small></div><div className="history-row"><IdCardIcon /><span><strong>主体身份核验</strong><small>2026-08-14 10:26 · 查询成功</small></span><em>有效</em></div></section>
        </section>
      )}
    </main>
  );
}

function MinePage({ loggedIn, hasWorkspace, hasPersonalFarmer, demoScenario, onLogin, onActor, onWorkbench, onSpaces, onProgress, onDemo, flash }: { loggedIn: boolean; hasWorkspace: boolean; hasPersonalFarmer: boolean; demoScenario: DemoScenario; onLogin: () => void; onActor: () => void; onWorkbench: () => void; onSpaces: () => void; onProgress: () => void; onDemo: () => void; flash: (message: string) => void }) {
  if (!loggedIn) {
    return (
      <main className="mine-page guest-mine">
        <section className="guest-profile"><img src="/assets/shennong/mascot.png" alt="神农码吉祥物" draggable={false} /><h1>登录后管理你的生产、服务和申请</h1><p>首次进入无需登录，只有收藏、发布、申请等具体动作才会触发。</p><button className="primary-button" onClick={onLogin}><MobileIcon />微信快捷登录</button><button className="secondary-button" onClick={onLogin}><IdCardIcon />手机号验证码登录</button></section>
        <button className="demo-review-entry guest-demo-entry" onClick={onDemo}><DashboardIcon /><span><strong>直接进入原型演示</strong><small>仅切换模拟数据，方便评审农户、组织与角色页面</small></span><ChevronRightIcon /></button>
        <section className="mine-menu"><MenuRow icon={HeartIcon} title="游客收藏" sub="保存在本机" onClick={() => flash("暂无游客收藏")} /><MenuRow icon={ClockIcon} title="扫码历史" sub="保存在本机" onClick={() => flash("暂无扫码历史")} /><MenuRow icon={InfoCircledIcon} title="帮助与客服" onClick={() => flash("进入帮助中心")} /></section>
        <p className="agreement-links">用户协议 · 隐私政策 · 个人信息清单</p>
      </main>
    );
  }

  const orgPreview = demoScenario.startsWith("org-");
  const institutionPreview = demoScenario === "gov-staff" || demoScenario === "bank-staff" || demoScenario === "ops-staff";
  const workspace = workspaceMeta[demoScenario];
  const workbenchLabel = demoScenario === "gov-staff" ? "政务" : demoScenario === "bank-staff" ? "银行" : demoScenario === "ops-staff" ? "运营" : orgPreview ? "组织" : "农户";

  return (
    <main className="mine-page">
      <section className="account-head"><div className="avatar"><PersonIcon /></div><span><small>神农码账号</small><h1>王建国</h1><p>138****2286 · {orgPreview || institutionPreview ? `已实名 · 已加入${institutionPreview ? "机构" : "组织"}` : realNameLabel(hasPersonalFarmer)}</p></span><button onClick={() => flash("进入账号安全设置")}><ChevronRightIcon /></button></section>

      <button className="demo-review-entry" onClick={onDemo}><DashboardIcon /><span><strong>原型演示模式</strong><small>仅用于评审，不是生产功能或真实主体切换</small></span><ChevronRightIcon /></button>

      {hasWorkspace ? (
        <section className="workspace-card">
          <div className="card-title"><span><small>当前工作空间</small><strong>{workspace.fullName}</strong></span><button onClick={onSpaces}>切换空间</button></div>
          <div className="workspace-status"><span>主体状态<b>{workspace.status}</b></span><span>当前角色<b>{workspace.role}</b></span><span>有效范围<b>{workspace.scope}</b></span></div>
          <button className="primary-button" onClick={onWorkbench}><DashboardIcon />进入{workbenchLabel}工作台</button>
        </section>
      ) : (
        <button className="start-card" onClick={onActor}><PlusIcon /><span><strong>开始使用神农码</strong><small>建立农户档案、创建或加入组织</small></span><ChevronRightIcon /></button>
      )}

      <section className="mine-menu">
        <div className="menu-group-title">空间管理</div>
        <MenuRow icon={DashboardIcon} title="我的工作空间" sub="当前空间、多组织关系与关联产品" onClick={onSpaces} />
        <MenuRow icon={PersonIcon} title="建立我的农户档案" sub={hasPersonalFarmer ? "已建立，可在工作空间中进入" : "三步轻量建档"} onClick={hasPersonalFarmer ? onSpaces : onActor} />
        <MenuRow icon={PlusIcon} title="创建组织工作空间" sub="企业、合作社、登记家庭农场或服务机构" onClick={onActor} />
        <MenuRow icon={IdCardIcon} title="加入已有组织" sub="一个账号可加入多个组织" onClick={onActor} />
        <MenuRow icon={LockClosedIcon} title="机构角色开通" sub="政务、银行、运营由机构管理员开通" onClick={onActor} />
      </section>
      <section className="mine-menu">
        <div className="menu-group-title">我的服务</div>
        <MenuRow icon={BookmarkIcon} title="收藏与关注" onClick={() => flash("进入收藏与关注")} />
        <MenuRow icon={ClockIcon} title="扫码与联系记录" onClick={() => flash("进入历史记录")} />
        <MenuRow icon={ClipboardIcon} title="反馈与申请进度" sub="组织认证待补件1项" onClick={onProgress} />
        <MenuRow icon={MixerHorizontalIcon} title="设置与隐私" onClick={() => flash("进入设置与隐私")} />
      </section>
    </main>
  );
}

function FarmServiceHome({ onBack, onCustomDemand, onProviderApply, onMyFarmService, onResource, onFilter, flash }: { onBack: () => void; onCustomDemand: () => void; onProviderApply: () => void; onMyFarmService: () => void; onResource: (category: FarmCategory, index: number) => void; onFilter: () => void; flash: (message: string) => void }) {
  const [category, setCategory] = useState<FarmCategory>("农事");
  const [voiceDraft, setVoiceDraft] = useState(false);
  const [queryText, setQueryText] = useState("");
  const [searched, setSearched] = useState(false);
  return (
    <main className="farm-service-page">
      <SubHeader title="码上农服" onBack={onBack} />
      <section className="farm-find-hero">
        <div className="farm-find-top"><small>公开查找 · 无需登录</small><button onClick={onMyFarmService}><ClipboardIcon />我的农服<em>2</em></button></div>
        <h1>我要找服务</h1>
        <p>先查附近服务，找不到合适的再发布定制需求。</p>
        <button className="provider-secondary" onClick={onProviderApply}><PlusIcon />我要成为服务提供方<ChevronRightIcon /></button>
      </section>

      <section className="service-query-card">
        <label className="service-voice-input"><MagnifyingGlassIcon /><KeyboardInput aria-label="农服需求" placeholder="输入需要的服务，如水稻收割" value={queryText} onChange={(event) => setQueryText(event.target.value)} /><button type="button" aria-label="语音说需求" onClick={() => { setVoiceDraft(true); setQueryText("厉山镇水稻收割，80亩，七天内"); flash("已生成查询草稿，请确认后查找"); }}><PaperPlaneIcon /></button></label>
        {voiceDraft && <div className="voice-draft"><span><small>语音识别草稿</small><strong>水稻收割 · 厉山镇 · 近7天 · 约80亩</strong></span><button onClick={() => { setVoiceDraft(false); setQueryText(""); }}>重说</button></div>}
        <div className="query-conditions"><button><BackpackIcon /><span><small>服务</small><strong>水稻收割</strong></span></button><button><SewingPinIcon /><span><small>地点</small><strong>曾都区</strong></span></button><button><CalendarIcon /><span><small>时间</small><strong>近7天</strong></span></button><button><TargetIcon /><span><small>规模</small><strong>约80亩</strong></span></button></div>
        <button className="primary-button" onClick={() => { setSearched(true); flash("已找到附近符合条件的服务"); }}>查找符合条件的服务</button>
        <p className="query-privacy"><LockClosedIcon />查询不需要登录，联系或发布需求时再确认主体</p>
      </section>

      <section className="nearby-service-section">
        <div className="nearby-service-title"><span><small>{searched ? "按查询条件匹配" : "默认推荐"}</small><strong>附近服务</strong></span><button onClick={() => flash("地图与列表共用当前查询条件")}><GlobeIcon />地图</button></div>
        <div className="service-category-row"><div>{(["农事", "农资", "农技"] as const).map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div><button className="filter-trigger" onClick={onFilter}><MixerHorizontalIcon />筛选</button></div>
        <div className="active-filter-row"><span>10km内</span><span>4.5分以上</span><span>参考费用</span></div>
        <div className="farm-resource-list">
          {farmResources[category].map((item, index) => (
            <button className="farm-resource-card" key={item.name} onClick={() => onResource(category, index)}>
              <div className="resource-card-head"><span className={`category-mark ${category}`}>{category === "农事" ? <BackpackIcon /> : category === "农资" ? <CubeIcon /> : <PersonIcon />}</span><span><small>{item.kind}</small><strong>{item.name}</strong><em>{item.provider}</em></span><ChevronRightIcon /></div>
              <div className="match-tags">{item.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
              <div className="service-facts"><span><SewingPinIcon />{item.distance}</span><span><StarIcon />{item.rating}</span><span><ClockIcon />{item.status}</span></div>
              <div className="resource-card-foot"><span><small>参考费用</small><strong>{item.fee}</strong></span><em>2026-08-14 更新</em></div>
            </button>
          ))}
        </div>
        <button className="custom-demand-entry" onClick={onCustomDemand}><PlusIcon /><span><strong>没有找到合适的服务？</strong><small>沿用当前条件，发布你的定制需求</small></span><ChevronRightIcon /></button>
        <div className="boundary-note farm-boundary"><InfoCircledIcon /><p>距离为粗粒度参考；评价仅来自已确认履约并展示样本数；费用为服务方公开参考，不是平台成交价。</p></div>
      </section>
    </main>
  );
}

function FarmServiceDetail({ resource, category, favorite, onBack, onFavorite, onChat, onContact, flash }: { resource: FarmResourceItem; category: FarmCategory; favorite: boolean; onBack: () => void; onFavorite: () => void; onChat: () => void; onContact: () => void; flash: (message: string) => void }) {
  const isFarmWork = category === "农事";
  return <main className="core-detail-page farm-service-detail-page">
    <SubHeader title="服务详情" onBack={onBack} />
    <section className="detail-hero-card">
      <div className="detail-kicker"><span>{resource.kind}</span><em>V3 · 8月14日更新</em></div>
      <h1>{resource.name}</h1><p>{resource.provider}</p>
      <div className="detail-status-row"><span><CheckCircledIcon />公开展示中</span><span><ClockIcon />{resource.status}</span></div>
    </section>
    <section className="match-reason-card"><div className="card-title"><strong>为什么适合你</strong><small>按当前查找条件</small></div><div className="match-reason-grid"><span><SewingPinIcon /><b>{resource.distance}</b><small>距离参考</small></span><span><TargetIcon /><b>80亩可接洽</b><small>规模匹配</small></span><span><CalendarIcon /><b>8月18—22日</b><small>时间窗口</small></span></div><div className="match-tags">{resource.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></section>
    <section className="detail-section-card"><div className="card-title"><strong>服务说明</strong><em>{category}</em></div><div className="detail-field-list"><div><span>服务范围</span><strong>{isFarmWork ? "曾都区、随县部分乡镇" : "随州市内可咨询"}</strong></div><div><span>最小服务量</span><strong>{isFarmWork ? "20亩" : "不限"}</strong></div><div><span>参考费用</span><strong>{resource.fee}</strong></div><div><span>联系提前量</span><strong>建议至少提前2天</strong></div></div><p className="plain-disclaimer">参考费用不是平台成交价，具体安排与费用由双方线下确认。</p></section>
    <section className="detail-section-card"><div className="card-title"><strong>能力与材料</strong><small>展示来源</small></div><div className="evidence-list"><div><CheckCircledIcon /><span><strong>{isFarmWork ? "农机与操作人员材料" : "机构与公开名录材料"}</strong><small>来源：服务方提交 · 运营形式核验 · 有效期至2027-03-31</small></span></div><div><CheckCircledIcon /><span><strong>已确认履约 23 次</strong><small>评价 4.8 分 · 仅统计双方已确认结果</small></span></div></div></section>
    <button className="provider-profile-entry" onClick={() => flash(`查看${resource.provider}的全部公开服务资源`)}><span className="provider-avatar"><BackpackIcon /></span><span><small>服务提供方</small><strong>{resource.provider}</strong><em>查看全部服务与主体公开信息</em></span><ChevronRightIcon /></button>
    <div className="boundary-note"><InfoCircledIcon /><p>平台展示核验来源和有效期，不替代现场安全检查，也不对线下交易、履约或结果作担保。</p></div>
    <div className="sticky-detail-actions farm-contact-actions"><button className={favorite ? "active" : ""} onClick={onFavorite}><HeartIcon />{favorite ? "已收藏" : "收藏"}</button><button onClick={onChat}><PaperPlaneIcon />在线沟通</button><button className="primary-button" onClick={onContact}><MobileIcon />请联系我</button></div>
  </main>;
}

function FarmServiceContact({ mode, resource, onBack, flash }: { mode: FarmContactMode; resource: FarmResourceItem; onBack: () => void; flash: (message: string) => void }) {
  return <main className="core-detail-page farm-contact-page"><SubHeader title={mode === "chat" ? "在线沟通" : "联系服务方"} onBack={onBack} />
    <section className="detail-hero-card contact-service-summary"><div className="detail-kicker"><span>联系前确认</span><em>资源 V3</em></div><h1>{resource.name}</h1><p>{resource.provider}</p><div className="detail-status-row"><span><CheckCircledIcon />公开展示中</span><span><ClockIcon />{resource.status}</span></div></section>
    {mode === "chat" ? <section className="contact-conversation"><div className="conversation-tip"><LockClosedIcon /><span><strong>先在平台内沟通，不自动公开手机号</strong><small>沟通记录仅用于本次服务接洽与争议核验。</small></span></div><div className="chat-bubble provider"><small>曾都惠农综合服务站 · 10:26</small><p>您好，请告诉我作业面积、位置和希望服务时间。</p></div><label className="form-field"><span>发送消息</span><KeyboardTextarea placeholder="例如：厉山镇约80亩，想在8月20日前完成收割" /></label><button className="primary-button" onClick={() => flash("消息已发送，未形成平台订单")}>发送消息<PaperPlaneIcon /></button></section> : <section className="callback-panel"><div className="callback-consent"><MobileIcon /><span><small>本次授权的联系电话</small><strong>138****2286</strong><em>仅向该服务方展示，24小时后自动失效</em></span></div><div className="detail-field-list"><div><span>方便联系时间</span><strong>今天 14:00—18:00</strong></div><div><span>联系目的</span><strong>了解服务时间与现场条件</strong></div><div><span>精确位置</span><strong>暂不授权，确认安排后再提供</strong></div></div><label className="check-line"><span className="checked-box"><CheckCircledIcon /></span><span>同意将脱敏后的联系方式用于本次服务接洽</span></label><button className="primary-button" onClick={() => flash("联系请求已发送，可在消息通知查看回复")}>发送联系请求<ChevronRightIcon /></button></section>}
    <div className="boundary-note"><InfoCircledIcon /><p>沟通与联系只建立线下接洽，不生成订单、不锁定服务时间，也不代表平台担保。</p></div>
  </main>;
}

function FarmServiceManagement({ tab, resourceState, onTab, onBack, onDemand, onResource, onHome, flash }: { tab: FarmManagementTab; resourceState: ResourcePublishState; onTab: (tab: FarmManagementTab) => void; onBack: () => void; onDemand: (scene: DemandScene) => void; onResource: () => void; onHome: () => void; flash: (message: string) => void }) {
  return <main className="core-list-page">
    <SubHeader title="我的农服" onBack={onBack} />
    <div className="prototype-inline-note"><InfoCircledIcon />当前为农户兼个人服务方演示数据，不是主体或身份切换。</div>
    <div className="management-tabs"><button className={tab === "demand" ? "active" : ""} onClick={() => onTab("demand")}>我的需求<em>3</em></button><button className={tab === "resource" ? "active" : ""} onClick={() => onTab("resource")}>我的资源<em>1</em></button></div>
    {tab === "demand" ? <>
      <section className="management-summary"><span><small>公开需求</small><strong>1</strong></span><span><small>待我确认</small><strong>1</strong></span><span><small>已完成</small><strong>1</strong></span></section>
      <section className="owned-card-list">
        <button onClick={() => onDemand("confirm")}><div><span className="status-pill warning">待确认</span><small>NF-20260814-016</small></div><strong>水稻机械收割服务</strong><p>王家湾2号地块 · 80亩 · 服务方已提交结果</p><footer><span>最晚今天18:00确认</span><em>查看验收<ChevronRightIcon /></em></footer></button>
        <button onClick={() => onDemand("published")}><div><span className="status-pill live">已发布</span><small>NF-XQ-20260815-008</small></div><strong>稻谷烘干定制需求</strong><p>曾都区厉山镇 · 约12吨 · 已收到2个响应</p><footer><span>8月16日 09:20发布</span><em>查看响应<ChevronRightIcon /></em></footer></button>
        <button onClick={() => onDemand("completed")}><div><span className="status-pill done">已完成</span><small>NF-20260809-011</small></div><strong>香菇菇棚消毒服务</strong><p>厉山镇1号菇棚 · 双方已确认 · 已关联生产周期</p><footer><span>结果已写入追溯</span><em>查看详情<ChevronRightIcon /></em></footer></button>
      </section>
      <button className="page-primary-entry" onClick={onHome}><MagnifyingGlassIcon />回到农服首页找服务</button>
    </> : <>
      <section className="management-summary"><span><small>公开展示</small><strong>{resourceState === "已发布" ? 1 : 0}</strong></span><span><small>待接洽</small><strong>3</strong></span><span><small>历史履约</small><strong>12</strong></span></section>
      <section className="owned-card-list resource-owned-list"><button onClick={onResource}><div><span className={`status-pill ${resourceState === "已发布" ? "live" : "warning"}`}>{resourceState}</span><small>V3 · 8月14日更新</small></div><strong>小型履带式水稻收割</strong><p>服务曾都区 · 20—120亩 · 近7天可接洽</p><div className="resource-mini-metrics"><span>咨询3</span><span>方案1</span><span>已确认12</span><span>异常0</span></div><footer><span>材料有效至2027-03-31</span><em>管理资源<ChevronRightIcon /></em></footer></button></section>
      <button className="page-primary-entry" onClick={() => flash("新建资源需先检查个人服务能力与材料") }><PlusIcon />上架新的服务资源</button>
      <div className="boundary-note"><InfoCircledIcon /><p>个人仅可上架已获准的低风险服务；机构资源与批量维护应在企业 PC 后台完成。</p></div>
    </>}
  </main>;
}

function FarmDemandDetail({ scene, onBack, onEdit, onConfirm, onTrace, flash }: { scene: DemandScene; onBack: () => void; onEdit: () => void; onConfirm: () => void; onTrace: () => void; flash: (message: string) => void }) {
  const config = scene === "published" ? { status: "已发布", code: "NF-XQ-20260815-008", title: "稻谷烘干定制需求", hint: "已收到2个服务方响应", color: "live" } : scene === "confirm" ? { status: "待我确认", code: "NF-20260814-016", title: "水稻机械收割服务", hint: "服务方已提交现场结果", color: "warning" } : { status: "已完成", code: "NF-20260809-011", title: "香菇菇棚消毒服务", hint: "双方确认结果已写入追溯", color: "done" };
  return <main className="core-detail-page demand-detail-page"><SubHeader title="需求详情" onBack={onBack} />
    <section className="detail-hero-card demand-hero"><div className="detail-kicker"><span className={`status-pill ${config.color}`}>{config.status}</span><em>{config.code}</em></div><h1>{config.title}</h1><p>{config.hint}</p></section>
    <section className="detail-section-card"><div className="card-title"><strong>我的需求</strong><small>发布快照</small></div><div className="detail-field-list"><div><span>生产对象</span><strong>{scene === "completed" ? "随州香菇 · 春季第3批" : "随州香稻 · 2026夏季"}</strong></div><div><span>服务位置</span><strong>曾都区厉山镇 · 精确位置仅授权后可见</strong></div><div><span>时间窗口</span><strong>2026-08-18—08-22</strong></div><div><span>规模</span><strong>{scene === "completed" ? "1号菇棚" : "约80亩"}</strong></div></div></section>
    {scene === "published" && <section className="response-list"><div className="card-title"><strong>服务方响应</strong><small>2个</small></div><button onClick={() => flash("查看服务方方案，不形成平台订单")}><span><strong>曾都惠农综合服务站</strong><small>预计18日可进场 · 参考按吨面议</small></span><em>查看方案</em><ChevronRightIcon /></button><button onClick={() => flash("查看服务方方案，不形成平台订单")}><span><strong>随州丰收农机服务中心</strong><small>建议先确认湿度与装卸条件</small></span><em>查看方案</em><ChevronRightIcon /></button></section>}
    {scene !== "published" && <section className="detail-section-card"><div className="card-title"><strong>服务结果</strong><small>服务方提交</small></div><div className="detail-field-list"><div><span>实际完成</span><strong>2026-08-14 16:20</strong></div><div><span>实际作业量</span><strong>{scene === "completed" ? "1个菇棚" : "78.6亩"}</strong></div><div><span>设备/人员</span><strong>履带式收割机1台 · 周师傅</strong></div><div><span>现场凭证</span><strong>照片3张 · 定位1条</strong></div></div><div className="source-chain"><CheckCircledIcon /><span><strong>{scene === "confirm" ? "等待你确认" : "双方已确认"}</strong><small>服务方提交 → 需求方确认 → {scene === "confirm" ? "确认后可按规则写入追溯" : "关联生产周期引用"}</small></span></div></section>}
    <section className="process-timeline"><div className="done"><i><CheckCircledIcon /></i><span><strong>需求已发布</strong><small>8月12日 09:20 · 王建国农户</small></span></div><div className="done"><i><CheckCircledIcon /></i><span><strong>{scene === "published" ? "收到服务方响应" : "已形成服务安排"}</strong><small>平台只记录协作事实，不形成线上订单</small></span></div><div className={scene === "published" ? "" : "done"}><i><ClockIcon /></i><span><strong>完成结果与确认</strong><small>{scene === "published" ? "尚未形成安排" : scene === "confirm" ? "等待需求方确认" : "双方已确认并保留快照"}</small></span></div></section>
    {scene === "published" && <div className="dual-action-bar"><button onClick={onEdit}>编辑需求</button><button onClick={() => flash("撤回前会再次确认；已有安排时只能关闭，不能抹除历史")}>撤回需求</button></div>}
    {scene === "confirm" && <div className="flow-foot core-flow-foot"><button className="primary-button" onClick={onConfirm}>确认服务已完成<ChevronRightIcon /></button><button className="secondary-button" onClick={() => flash("已标记结果有异议，等待服务方补充")}>结果有异议</button></div>}
    {scene === "completed" && <button className="page-primary-entry" onClick={onTrace}><FileTextIcon />查看关联的生产时间线</button>}
    <div className="boundary-note"><InfoCircledIcon /><p>需求、服务安排和完成结果是三个不同阶段。只有双方确认且关联生产对象的完成结果，才可进入追溯时间线。</p></div>
  </main>;
}

function FarmResourceDetail({ state, version, onBack, onEdit, onState, flash }: { state: ResourcePublishState; version: number; onBack: () => void; onEdit: () => void; onState: () => void; flash: (message: string) => void }) {
  return <main className="core-detail-page resource-detail-page"><SubHeader title="资源管理" onBack={onBack} />
    <section className="detail-hero-card"><div className="detail-kicker"><span className={`status-pill ${state === "已发布" ? "live" : "warning"}`}>{state}</span><em>V{version} · 资源 SN-FS-000318</em></div><h1>小型履带式水稻收割</h1><p>王建国农户 · 个人服务能力已开通</p><div className="detail-status-row"><span><ClockIcon />近7天可接洽</span><span><TargetIcon />20—120亩</span></div></section>
    <div className="resource-performance"><span><small>咨询</small><strong>3</strong></span><span><small>方案</small><strong>1</strong></span><span><small>已确认</small><strong>12</strong></span><span><small>异常</small><strong>0</strong></span></div>
    <section className="detail-section-card"><div className="card-title"><strong>公开字段</strong><button onClick={() => flash("正在以公众身份预览资源详情")}>公众预览</button></div><div className="detail-field-list"><div><span>服务项目</span><strong>水稻机械收割</strong></div><div><span>服务区域</span><strong>曾都区，超20km需另行确认</strong></div><div><span>可用时间</span><strong>2026-08-18—09-10</strong></div><div><span>参考费用</span><strong>88—95元/亩</strong></div><div><span>公开联系方式</span><strong>平台内联系 · 手机号授权后可见</strong></div></div></section>
    <section className="detail-section-card"><div className="card-title"><strong>能力材料</strong><small>发布校验</small></div><div className="evidence-list"><div><CheckCircledIcon /><span><strong>主机：履带式收割机</strong><small>设备编号尾号 628 · 权属材料有效</small></span></div><div><CheckCircledIcon /><span><strong>操作人员：王建国</strong><small>准驾/培训材料有效至2027-03-31</small></span></div><div><InfoCircledIcon /><span><strong>保险：服务方自报已投保</strong><small>平台仅展示材料来源，不承担保险责任</small></span></div></div></section>
    <div className="dual-action-bar resource-actions"><button onClick={onEdit}><ClipboardIcon />编辑并发布新版本</button><button onClick={onState}>{state === "已发布" ? "暂停/下架" : "恢复/调整"}</button></div>
    <div className="boundary-note"><InfoCircledIcon /><p>资源被需求或履约引用后不能物理删除。编辑会生成新版本，历史业务继续展示当时快照。</p></div>
  </main>;
}

function FarmResourceEdit({ version, onBack, onSave }: { version: number; onBack: () => void; onSave: () => void }) {
  return <main className="flow-page resource-edit-page"><SubHeader title="编辑服务资源" onBack={onBack} /><FlowIntro step={`基于 V${version} 创建新版本`} title="更新公开资源" desc="保存后生成新版本；历史需求与履约记录不会被改写。" icon={ClipboardIcon} />
    <section className="form-panel compact"><SelectRow label="服务项目" value="农事 · 水稻机械收割" /><label className="form-field"><span>资源名称</span><KeyboardInput defaultValue="小型履带式水稻收割" /></label><SelectRow label="服务区域" value="随州市曾都区" /><div className="inline-fields"><label className="form-field"><span>最小规模</span><KeyboardInput inputMode="decimal" defaultValue="20亩" /></label><label className="form-field"><span>最大规模</span><KeyboardInput inputMode="decimal" defaultValue="120亩" /></label></div><SelectRow label="可用时间" value="2026-08-18—09-10" /><SelectRow label="接洽提前量" value="至少提前2天" /><label className="form-field"><span>参考费用</span><KeyboardInput defaultValue="88—95元/亩" /></label><label className="form-field"><span>服务说明</span><KeyboardInput defaultValue="适合中小地块，软地块需先确认进场条件" /></label><button className="evidence-row"><IdCardIcon /><span><small>关联能力材料</small><strong>主机1台 · 操作人员1名 · 保险材料1项</strong></span><ChevronRightIcon /></button></section>
    <label className="trace-confirm-line"><CheckCircledIcon /><span>我已核对服务范围、可用时间、费用参考和材料有效期</span></label><div className="flow-foot"><button className="primary-button" onClick={onSave}>保存并发布 V{version + 1}<ChevronRightIcon /></button></div>
  </main>;
}

function ModulePage({ module, onBack, onPrimary, onSecondary, flash }: { module: ModuleItem; onBack: () => void; onPrimary: () => void; onSecondary: () => void; flash: (message: string) => void }) {
  const Icon = module.icon;
  return (
    <main className="module-page">
      <SubHeader title={module.name} onBack={onBack} />
      <section className={`module-public-hero ${module.tone}`}><span className="hero-module-icon"><Icon /></span><small>公开服务 · 进入模块无需登录</small><h1>{module.publicTitle}</h1><p>{module.publicDesc}</p></section>
      <section className="module-actions"><button className="primary-button" onClick={onPrimary}><MagnifyingGlassIcon />{module.primary}</button><button className="secondary-button" onClick={onSecondary}><PlusIcon />{module.secondary}</button></section>

      {module.key === "farm" && (
        <section className="farm-search-card">
          <div className="mode-tabs"><button className="active">我要找服务</button><button onClick={() => flash("提供服务不是身份切换，需按风险等级申请能力")}>我要提供服务</button></div>
          <button className="search-condition"><BackpackIcon /><span><small>需要什么服务</small><strong>水稻收割</strong></span><ChevronRightIcon /></button>
          <div className="condition-row"><button><SewingPinIcon /><span><small>服务区域</small><strong>曾都区</strong></span></button><button><CalendarIcon /><span><small>时间</small><strong>近 7 天</strong></span></button></div>
          <button className="primary-button" onClick={() => flash("已找到 6 家符合条件的服务方")}>查找符合条件的服务</button>
        </section>
      )}

      <section className="public-list-section">
        <div className="card-title"><strong>{module.key === "farm" ? "为你匹配" : "公开信息"}</strong><button onClick={() => flash("已切换筛选条件")}><MixerHorizontalIcon />筛选</button></div>
        {publicCards[module.key].map((item) => (
          <button className="public-resource" key={item.title} onClick={() => flash(`${item.title}详情为公开浏览内容`)}><span className={`resource-icon ${module.tone}`}><Icon /></span><span><strong>{item.title}</strong><small>{item.meta}</small></span><em>{item.tag}</em><ChevronRightIcon /></button>
        ))}
      </section>
      <div className="boundary-note"><InfoCircledIcon /><p>{module.key === "trade" ? "一期只做供需展示、联系授权和线下结果确认，不做线上支付结算。" : module.key === "finance" ? "平台不放贷、不担保，申请结果以金融机构独立审核为准。" : "公开信息展示来源与更新时间；收藏、联系、发布或申请时再登录。"}</p></div>
    </main>
  );
}

function BusinessModuleHome({ module, onBack, onDetail, onMap, onPrimary, onSecondary, onManage, onProvider, flash }: { module: ModuleItem & { key: Exclude<ModuleKey, "trace" | "farm"> }; onBack: () => void; onDetail: (index: number) => void; onMap: () => void; onPrimary: () => void; onSecondary: () => void; onManage: () => void; onProvider: () => void; flash: (message: string) => void }) {
  const Icon = module.icon;
  const labels = module.key === "cold" ? { primary: "地图找冷链", secondary: "发布冷链需求", manage: "我的冷链" } : module.key === "brand" ? { primary: "建立我的品牌", secondary: "申请使用品牌", manage: "我的品牌" } : module.key === "trade" ? { primary: "发布供应", secondary: "发布采购需求", manage: "我的供需" } : { primary: "查看产品条件", secondary: "提交服务意向", manage: "我的银行服务" };
  return <main className={`business-module-home ${module.key}-home`}>
    <SubHeader title={module.name} onBack={onBack} />
    <section className={`business-module-hero ${module.tone}`}><span><Icon /></span><div><small>公开信息先看 · 办理时再认证</small><h1>{module.publicTitle}</h1><p>{module.publicDesc}</p></div></section>
    {module.key === "cold" && <section className="business-search-panel cold-search-panel"><div className="business-search-heading"><span><small>酒店式条件查找</small><strong>我要找冷链</strong></span><button onClick={onMap}><GlobeIcon />地图</button></div><button className="speech-business-search" onClick={() => flash("请说：明天下午六百斤鲜香菇找冷藏车")}><MagnifyingGlassIcon /><span><strong>冷库、冷藏车、预冷点</strong><small>可输入或语音描述产品、时间和区域</small></span><MobileIcon /></button><div className="condition-grid"><button><small>存/运什么</small><strong>鲜香菇</strong></button><button><small>什么时候</small><strong>明天下午</strong></button><button><small>大约多少</small><strong>600斤</strong></button><button><small>希望区域</small><strong>曾都区</strong></button></div><button className="primary-button" onClick={onMap}>查找符合条件的冷链<ChevronRightIcon /></button></section>}
    {module.key === "brand" && <section className="business-search-panel brand-search-panel"><div className="business-search-heading"><span><small>品牌广场</small><strong>查品牌、查授权产品</strong></span><em>随州试点</em></div><button className="speech-business-search" onClick={() => flash("请说：找随县香菇品牌")}><MagnifyingGlassIcon /><span><strong>搜索品牌、主体或产品</strong><small>支持语音：找随县香菇品牌</small></span><MobileIcon /></button><div className="business-chip-row"><button className="active">全部</button><button>香菇</button><button>香稻</button><button>曾都区</button></div></section>}
    {module.key === "trade" && <section className="business-search-panel trade-search-panel"><div className="business-search-heading"><span><small>供需大厅</small><strong>找真实货源与采购需求</strong></span><em>不含支付</em></div><div className="trade-home-tabs"><button className="active">找供应</button><button>找采购</button></div><button className="speech-business-search" onClick={() => flash("请说：找随州鲜香菇供应")}><MagnifyingGlassIcon /><span><strong>产品、品种、地区</strong><small>原粮、初级农产品、加工品、品牌成品</small></span><MobileIcon /></button><div className="business-chip-row"><button className="active">全部阶段</button><button>原粮</button><button>鲜品</button><button>加工品</button></div></section>}
    {module.key === "finance" && <section className="business-search-panel finance-search-panel"><div className="finance-provider-note"><LockClosedIcon /><span><strong>产品由合作银行提供</strong><small>神农码不放贷、不担保、不测额，也不收取贷款手续费。</small></span></div><button className="speech-business-search" onClick={() => flash("已打开产品条件筛选")}><MagnifyingGlassIcon /><span><strong>按区域与经营用途找产品</strong><small>曾都区 · 农户/企业 · 经营周转</small></span><MixerHorizontalIcon /></button><div className="business-chip-row"><button className="active">曾都区</button><button>香菇产业</button><button>经营周转</button></div></section>}
    <section className="business-action-triad"><button onClick={onPrimary}><Icon /><span><strong>{labels.primary}</strong><small>{module.key === "brand" ? "有真实权利依据" : module.key === "trade" ? "农户/企业可发布" : module.key === "finance" ? "先看完整成本与条件" : "列表地图同条件"}</small></span></button><button onClick={onSecondary}><PlusIcon /><span><strong>{labels.secondary}</strong><small>{module.key === "brand" ? "按品牌规则申请" : module.key === "trade" ? "组织主体办理" : module.key === "finance" ? "不是贷款申请" : "找不到再发布"}</small></span></button><button onClick={onManage}><ClipboardIcon /><span><strong>{labels.manage}</strong><small>进度、记录与异常</small></span></button></section>
    {module.key === "brand" && <section className="government-recommend-card"><div><BadgeIcon /><span><small>政府推荐展示 · 有效至2026-12-31</small><strong>随州特色农产品品牌专区</strong></span></div><p>推荐单位：随州市农业农村局；表示公共展示服务，不代表政府认证或品质担保。</p></section>}
    <section className="business-public-list"><div className="business-list-title"><span><small>{module.key === "cold" ? "统一列表/地图条件" : module.key === "brand" ? "自然检索结果" : module.key === "trade" ? "信息最近已更新" : "银行审定内容"}</small><strong>{module.key === "cold" ? "附近冷链资源" : module.key === "brand" ? "随州品牌" : module.key === "trade" ? "最新供需" : "涉农贷款产品"}</strong></span><button onClick={() => flash("已打开筛选：区域、类型、时间与有效状态")}><MixerHorizontalIcon />筛选</button></div>{publicCards[module.key].map((item, index) => <button className="business-public-card" key={item.title} onClick={() => onDetail(index)}><span className={`business-card-icon ${module.tone}`}><Icon /></span><span><small>{item.tag}</small><strong>{item.title}</strong><em>{item.meta}</em>{module.key === "cold" && <b>{index === 0 ? "库容规模500吨 · 所选时段平台可接洽约30吨 · 10:20更新" : "机构网点与常用线路 · 不展示车辆实时位置"}</b>}{module.key === "brand" && <b>{index === 0 ? "依据：集体/证明商标管理规则 · 8月12日核验" : "档案建设中 · 不显示虚构授权产品"}</b>}{module.key === "trade" && <b>{index === 0 ? "来源批次可追溯 · 参考量非实时库存" : "规格、证据要求与交付区域已公开"}</b>}{module.key === "finance" && <b>{index === 0 ? "适用随州市 · 12个月内 · 银行版本2026-08-01" : "最终条件与结果以银行审批和合同为准"}</b>}</span><ChevronRightIcon /></button>)}</section>
    {module.key === "cold" && <button className="weak-provider-entry" onClick={onProvider}><DashboardIcon /><span><strong>我要成为冷链服务提供方</strong><small>已认证组织可申请能力，资源批量维护转 PC</small></span><ChevronRightIcon /></button>}
    <div className="boundary-note business-home-boundary"><InfoCircledIcon /><p>{module.key === "cold" ? "容量展示为服务方分配给神农码的时段可接洽额度，不代表全渠道实时剩余。" : module.key === "brand" ? "品牌建档、授权和用标是三个独立业务对象，公众可核验但不将建档写成品质认证。" : module.key === "trade" ? "一期只做供需展示、联系授权、合作意向和线下交付确认，不做线上订单、支付或结算。" : "提交的是银行服务意向。真实申请、征信、审批、签约、放款和还款均在银行官方渠道完成。"}</p></div>
  </main>;
}

function ColdChainMap({ onBack, onDetail, onDemand, flash }: { onBack: () => void; onDetail: (index: number) => void; onDemand: () => void; flash: (message: string) => void }) {
  return <main className="cold-map-page"><SubHeader title="冷链资源地图" onBack={onBack} /><section className="map-filter-strip"><button className="active">曾都区</button><button>冷库</button><button>0—5℃</button><button onClick={() => flash("已打开更多筛选")}>更多</button></section><section className="illustrated-map" aria-label="冷链资源示意地图"><div className="map-area-label north">随县</div><div className="map-area-label center">曾都区</div><div className="map-area-label south">广水市</div><button className="map-cluster cluster-one" onClick={() => onDetail(0)}>6</button><button className="map-cluster cluster-two" onClick={() => onDetail(1)}>3</button><button className="map-search-area" onClick={() => flash("已按当前地图范围刷新7条公开资源")}>搜索此区域</button><div className="map-privacy-note"><LockClosedIcon />公开位置为机构网点或区域点，不显示私人场所和车辆实时轨迹</div></section><section className="map-result-drawer"><div className="card-title"><strong>当前区域 7 条资源</strong><small>列表条件已保留</small></div><button onClick={() => onDetail(0)}><CubeIcon /><span><small>固定冷库 · 3.2km</small><strong>随州惠农冷链中心</strong><em>冷藏0—5℃ · 所选时段平台可接洽约30吨</em></span><ChevronRightIcon /></button><button onClick={() => onDetail(1)}><GlobeIcon /><span><small>冷藏运输 · 服务区域</small><strong>鲜达冷藏运输</strong><em>曾都区—随州城区 · 具体车辆需确认</em></span><ChevronRightIcon /></button></section><button className="page-primary-entry" onClick={onDemand}><PlusIcon />没有合适资源？发布冷链需求</button></main>;
}

function BusinessPublicDetail({ moduleKey, cardIndex, onBack, onProducts, onPrimary, onSecondary, flash }: { moduleKey: Exclude<ModuleKey, "trace" | "farm">; cardIndex: number; onBack: () => void; onProducts: () => void; onPrimary: () => void; onSecondary: () => void; flash: (message: string) => void }) {
  const module = modules.find((item) => item.key === moduleKey)!;
  const item = publicCards[moduleKey][cardIndex] ?? publicCards[moduleKey][0];
  const configs = {
    cold: { kicker: "固定冷库 · 信息于今日10:20确认", fields: [["服务能力", "鲜品预冷、冷藏0—5℃、冷冻-18℃"], ["设施规模", "物理库容500吨 · 分区管理"], ["所选时段", "平台参考可接洽约30吨 · 非全渠道实时余量"], ["温控证据", "连续设备记录 · 异常人工复核"], ["公开位置", "对外服务入口 · 允许导航"], ["平台履约", "近12个月双方确认18次"]], note: "服务方提交 · 运营形式核验 · 2026-08-15更新" },
    brand: { kicker: "区域公用品牌 · 档案正常展示", fields: [["品牌定位", "区域公用品牌 · 香菇产业"], ["主要区域", "随州市 · 曾都区/随县"], ["管理主体", "随州香菇产业协会"], ["权利依据", "集体/证明商标相关管理依据"], ["依据状态", "有效 · 2026-08-12最近核验"], ["公开授权", "12个主体 · 26个产品/SKU"]], note: "建档不等于政府认证；各项依据和授权分别核验" },
    trade: { kicker: cardIndex === 0 ? "供应 · 初级农产品" : "采购需求 · 原粮", fields: [["货品", cardIndex === 0 ? "鲜香菇 · 菇径4—6cm" : "优质香稻稻谷 · 鄂香2号"], ["参考数量", cardIndex === 0 ? "约2,000kg · 8月15日更新" : "30吨 · 可分3批响应"], ["来源/要求", cardIndex === 0 ? "生产批次SN-PC-20260815-016" : "追溯/检测/主体承诺任一"], ["价格", "面议 · 不含平台成交价"], ["交付区域", cardIndex === 0 ? "曾都区 · 需冷链" : "曾都区加工园"], ["有效期", "至2026-08-18 18:00"]], note: "主体发布 · 公开信息只用于供需撮合" },
    finance: { kicker: "合作银行产品 · 银行审定版本", fields: [["提供机构", "随州农商行 · 厉山支行"], ["适用范围", "随州市香菇种植/经营主体"], ["用途", "菌棒、原料、设备和经营周转"], ["额度口径", "产品范围内申请 · 最终由银行审批"], ["期限/成本", "12个月内 · 年化成本以银行合同为准"], ["担保方式", "按银行具体产品条件执行"]], note: "银行审定版本2026-08-01 · 有效至2026-12-31" },
  }[moduleKey];
  return <main className={`core-detail-page business-public-detail ${moduleKey}-detail`}><SubHeader title={`${module.name}详情`} onBack={onBack} /><section className={`detail-hero-card ${module.tone}`}><div className="detail-kicker"><span>{configs.kicker}</span><em>{item.tag}</em></div><h1>{item.title}</h1><p>{item.meta}</p><div className="detail-status-row"><span><CheckCircledIcon />公开信息可核验</span><span><ClockIcon />版本有效</span></div></section><section className="detail-section-card"><div className="card-title"><strong>核心信息</strong><small>首屏重要字段</small></div><div className="detail-field-list">{configs.fields.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</div></section>{moduleKey === "brand" && <button className="provider-profile-entry" onClick={onProducts}><BadgeIcon /><span><small>授权关系可查</small><strong>查看授权产品与公开批次</strong><em>产品/SKU、授权范围、期限与追溯</em></span><ChevronRightIcon /></button>}{moduleKey === "finance" && <section className="detail-section-card"><div className="card-title"><strong>办理材料与官方渠道</strong><small>银行提供</small></div><div className="evidence-list"><div><FileTextIcon /><span><strong>主体与经营项目基础材料</strong><small>高敏感原件优先在银行官方渠道提交</small></span></div><div><MobileIcon /><span><strong>官方客服 96568</strong><small>可核实产品与网点，不向非官方人员支付手续费</small></span></div></div></section>}<section className="detail-section-card"><div className="card-title"><strong>来源与更新时间</strong><small>可追责</small></div><div className="source-chain"><CheckCircledIcon /><span><strong>{configs.note}</strong><small>如外部状态同步失败，页面保留最近成功时间并标记待同步。</small></span></div></section><div className="business-detail-actions"><button onClick={() => flash(`已收藏${item.title}`)}><HeartIcon />收藏</button><button className="secondary-button" onClick={onSecondary}>{moduleKey === "cold" ? "请联系我" : moduleKey === "brand" ? "查看授权产品" : moduleKey === "trade" ? "举报/纠错" : "提交服务意向"}</button><button className="primary-button" onClick={onPrimary}>{moduleKey === "cold" ? "提交定向需求" : moduleKey === "brand" ? "申请使用品牌" : moduleKey === "trade" ? "提交合作意向" : "去银行官方渠道"}</button></div><div className="boundary-note"><InfoCircledIcon /><p>{moduleKey === "cold" ? "资源详情不能承诺容量或排班；双方确认后才形成服务安排。" : moduleKey === "brand" ? "申请与授权按当前办理主体计算，公众浏览无需选择主体。" : moduleKey === "trade" ? "合作意向不是订单，交付、合同与付款在线下确认。" : "神农码不参与银行授信决策，也不展示平台评分或推荐额度。"}</p></div></main>;
}

function BrandAuthorizedProducts({ onBack, onTrace, onApply, flash }: { onBack: () => void; onTrace: () => void; onApply: () => void; flash: (message: string) => void }) {
  return <main className="core-list-page brand-products-page"><SubHeader title="授权产品" onBack={onBack} /><section className="brand-product-summary"><BadgeIcon /><span><small>随州香菇 · 当前有效公开授权</small><strong>12个主体 · 26个产品/SKU</strong><em>不以批次数、浏览量或扫码量代表销量</em></span></section><div className="business-chip-row brand-product-filter"><button className="active">当前有效</button><button>鲜品</button><button>干制品</button><button>加工品</button></div><section className="owned-card-list"><button onClick={onTrace}><div><span className="status-pill live">授权有效</span><small>至2027-08-31</small></div><strong>随州香菇 · 250g干品礼盒</strong><p>湖北随州丰禾农业有限公司 · 线下经销/团采</p><footer><span>公开可追溯批次 3</span><em>查看追溯<ChevronRightIcon /></em></footer></button><button onClick={() => flash("产品授权范围：鲜品、厉山镇1号基地、线下批发") }><div><span className="status-pill live">授权有效</span><small>至2026-12-31</small></div><strong>鲜香菇 · 一级品</strong><p>随州绿源合作社 · 厉山镇1号基地</p><footer><span>公开可追溯批次 8</span><em>查看范围<ChevronRightIcon /></em></footer></button></section><button className="page-primary-entry" onClick={onApply}><PlusIcon />申请使用该品牌</button><div className="boundary-note"><InfoCircledIcon /><p>授权关系明确到产品、场所、区域、渠道和期限；品牌档案存在不代表所有产品均可使用。</p></div></main>;
}

function BusinessEligibilityGate({ action, onBack, onCreateOrg, onSpaces }: { action: BusinessAction; onBack: () => void; onCreateOrg: () => void; onSpaces: () => void }) {
  return <main className="flow-page business-gate-page"><SubHeader title="办理条件" onBack={onBack} /><FlowIntro step="当前主体不可办理" title={businessActionLabels[action]} desc="该事项需要已认证经营组织及对应业务能力；个人账号本身不被限制，可继续浏览或使用其他空间。" icon={LockClosedIcon} /><section className="gate-check-list"><div className="done"><CheckCircledIcon /><span><strong>个人账号与实名</strong><small>王建国 · 已完成</small></span></div><div><InfoCircledIcon /><span><strong>经营主体</strong><small>当前为个人农户空间，本事项要求认证组织</small></span></div><div><LockClosedIcon /><span><strong>业务能力与成员权限</strong><small>进入表单和提交时都会重新校验</small></span></div></section><div className="boundary-note"><InfoCircledIcon /><p>认证、成员关系和能力开通是三件事。加入多个组织后，只显示本事项可用的主体供选择。</p></div><div className="auth-progress-actions"><button className="primary-button" onClick={onSpaces}>选择其他工作空间</button><button className="secondary-button" onClick={onCreateOrg}>创建/认证组织</button><button className="text-button" onClick={onBack}>返回公开详情</button></div></main>;
}

function BusinessActionForm({ action, step, subjectName, onBack, onNext, flash }: { action: BusinessAction; step: number; subjectName: string; onBack: () => void; onNext: () => void; flash: (message: string) => void }) {
  const allSteps = businessActionSteps[action];
  const config = allSteps[step - 1] ?? allSteps[0];
  const subjectLabels = new Set(["当前主体", "申请主体", "发布主体", "采购主体", "接收主体", "意向主体"]);
  return <main className={`flow-page business-action-form ${businessActionModule[action]}-form`}><SubHeader title={businessActionLabels[action]} onBack={onBack} /><div className="step-rail business-step-rail">{allSteps.map((_, index) => <span key={index} className={step >= index + 1 ? "active" : ""}>{index + 1}</span>)}</div><FlowIntro step={`${step} / ${allSteps.length}`} title={config.title} desc={config.desc} icon={businessActionModule[action] === "cold" ? CubeIcon : businessActionModule[action] === "brand" ? BadgeIcon : businessActionModule[action] === "trade" ? BarChartIcon : IdCardIcon} /><section className="form-panel compact">{config.fields.map((field) => { const value = subjectLabels.has(field.label) ? subjectName : field.value; return field.input ? <label className="form-field" key={field.label}><span>{field.label}</span><KeyboardInput defaultValue={value} /></label> : <SelectRow key={field.label} label={field.label} value={value} />; })}{step === allSteps.length && action !== "finance-channel" && <label className="check-line"><span className="checked-box"><CheckCircledIcon /></span><span>确认当前办理主体、字段范围、来源与公开边界正确</span></label>}</section>{config.notice && <div className="boundary-note"><InfoCircledIcon /><p>{config.notice}</p></div>}<div className="flow-foot"><button className="primary-button" onClick={onNext}>{step < allSteps.length ? "保存并继续" : action === "finance-channel" ? "确认并打开银行渠道" : "确认提交"}<ChevronRightIcon /></button>{action !== "finance-channel" && <button className="text-button" onClick={() => flash("草稿已保存，未产生公开记录或业务状态")}>保存草稿，稍后继续</button>}</div></main>;
}

function BusinessManagement({ moduleKey, onBack, onRecord, onNew, flash }: { moduleKey: Exclude<ModuleKey, "trace" | "farm">; onBack: () => void; onRecord: (action: BusinessAction, state: BusinessRecordState) => void; onNew: (action: BusinessAction) => void; flash: (message: string) => void }) {
  const config = moduleKey === "cold" ? { title: "我的冷链", metrics: ["公开需求 1", "待确认 1", "已完成 3"], actions: ["cold-demand", "cold-provider"] as BusinessAction[], records: [["冷库需求 · 鲜香菇600斤", "待机构响应", "cold-demand", "submitted"], ["冷链安排 · 8月18日入库", "待双方确认", "cold-demand", "responded"]] as const } : moduleKey === "brand" ? { title: "我的品牌服务", metrics: ["我的品牌 1", "申请办理 2", "有效授权 3"], actions: ["brand-create", "brand-apply", "brand-batch"] as BusinessAction[], records: [["随州香菇品牌使用申请", "品牌方办理中", "brand-apply", "responded"], ["丰禾香稻品牌档案", "待形式核验", "brand-create", "submitted"]] as const } : moduleKey === "trade" ? { title: "我的供需", metrics: ["展示中 2", "合作意向 3", "待接收 1"], actions: ["trade-supply", "trade-demand", "trade-delivery"] as BusinessAction[], records: [["鲜香菇供应2,000kg", "展示中", "trade-supply", "submitted"], ["合作意向 · 500kg", "双方已确认", "trade-intent", "confirmed"], ["实际交付 · 498kg", "待收方确认", "trade-delivery", "responded"]] as const } : { title: "我的银行服务", metrics: ["服务意向 2", "有效授权 1", "银行消息 3"], actions: ["finance-intent"] as BusinessAction[], records: [["香菇经营周转服务意向", "银行待联系", "finance-intent", "responded"], ["经营数据固定快照", "授权至9月15日", "finance-intent", "confirmed"]] as const };
  return <main className="core-list-page business-management-page"><SubHeader title={config.title} onBack={onBack} /><div className="prototype-inline-note"><InfoCircledIcon />当前只展示当前办理主体的数据；切换组织需退出表单后重新加载权限。</div><section className="management-summary">{config.metrics.map((item) => { const [label, count] = item.split(" "); return <span key={item}><small>{label}</small><strong>{count}</strong></span>; })}</section><section className="business-management-actions">{config.actions.map((action) => <button key={action} onClick={() => onNew(action)}><PlusIcon /><span><strong>{businessActionLabels[action]}</strong><small>办理前重新检查主体与权限</small></span></button>)}</section><section className="owned-card-list">{config.records.map(([title, status, action, state]) => <button key={title} onClick={() => onRecord(action, state)}><div><span className={`status-pill ${state === "confirmed" ? "done" : state === "responded" ? "warning" : "live"}`}>{status}</span><small>2026-08-15 更新</small></div><strong>{title}</strong><p>归属：当前工作空间 · 经办人王建国</p><footer><span>状态、字段与操作均可追溯</span><em>查看详情<ChevronRightIcon /></em></footer></button>)}</section><div className="boundary-note"><InfoCircledIcon /><p>{moduleKey === "finance" ? "服务意向和授权可撤回后续读取；银行内部审批意见不会回传神农码。" : "记录被其他对象引用后不能物理删除；变更使用版本、撤回或冲正并保留历史。"}</p></div></main>;
}

function BusinessRecordDetail({ action, state, onBack, onAdvance, onTrace, onManage, onAction, flash }: { action: BusinessAction; state: BusinessRecordState; onBack: () => void; onAdvance: () => void; onTrace: () => void; onManage: () => void; onAction: (action: BusinessAction) => void; flash: (message: string) => void }) {
  const moduleKey = businessActionModule[action];
  const statusLabel = state === "submitted" ? (moduleKey === "cold" ? "待机构响应" : moduleKey === "brand" ? "待办理" : moduleKey === "trade" ? "展示/待响应" : "银行待接收") : state === "responded" ? (moduleKey === "cold" ? "待双方确认" : moduleKey === "brand" ? "办理中/待确认" : moduleKey === "trade" ? "待接收确认" : "银行待联系") : "已确认/已完成";
  return <main className="core-detail-page business-record-page"><SubHeader title="业务记录详情" onBack={onBack} /><section className="detail-hero-card"><div className="detail-kicker"><span className={`status-pill ${state === "confirmed" ? "done" : state === "responded" ? "warning" : "live"}`}>{statusLabel}</span><em>SN-{moduleKey.toUpperCase()}-20260815-016</em></div><h1>{businessActionLabels[action]}</h1><p>当前主体 · 经办人王建国 · 2026-08-15 11:26更新</p></section><section className="detail-section-card"><div className="card-title"><strong>业务快照</strong><small>提交后锁定版本</small></div><div className="detail-field-list">{businessActionSteps[action].flatMap((stepConfig) => stepConfig.fields).slice(0, 6).map((field, index) => <div key={`${field.label}-${index}`}><span>{field.label}</span><strong>{field.value}</strong></div>)}</div></section><section className="process-timeline"><div className="done"><i><CheckCircledIcon /></i><span><strong>草稿校验并提交</strong><small>当前主体、成员权限和业务能力通过</small></span></div><div className={state !== "submitted" ? "done" : ""}><i>{state !== "submitted" ? <CheckCircledIcon /> : <ClockIcon />}</i><span><strong>{moduleKey === "cold" ? "机构响应/容量确认" : moduleKey === "brand" ? "管理方办理/形式核验" : moduleKey === "trade" ? "对方响应/双方确认" : "银行接收并联系"}</strong><small>{state === "submitted" ? "等待当前责任方处理" : "已留存处理人、时间和范围"}</small></span></div><div className={state === "confirmed" ? "done" : ""}><i>{state === "confirmed" ? <CheckCircledIcon /> : <LockClosedIcon />}</i><span><strong>{moduleKey === "cold" ? "服务安排/完成确认" : moduleKey === "brand" ? "授权/用标结果" : moduleKey === "trade" ? "实际交付/接收" : "转银行官方渠道/服务结束"}</strong><small>{state === "confirmed" ? "终态已形成，可查看关联对象" : "前一节点完成后开放"}</small></span></div></section>{state !== "confirmed" && <button className="admin-demo-entry" onClick={onAdvance}><InfoCircledIcon /><span><strong>原型演示：推进到下一业务状态</strong><small>正式环境只能由当前责任方按权限处理</small></span><ChevronRightIcon /></button>}{moduleKey === "brand" && state === "confirmed" && <button className="page-primary-entry" onClick={() => onAction("brand-batch")}><BadgeIcon />登记批次用标</button>}{moduleKey === "trade" && state === "confirmed" && action === "trade-intent" && <button className="page-primary-entry" onClick={() => onAction("trade-delivery")}><BarChartIcon />登记实际交付</button>}{moduleKey === "trade" && state !== "confirmed" && action === "trade-delivery" && <button className="page-primary-entry" onClick={() => onAction("trade-receipt")}><CheckCircledIcon />进入接收确认</button>}{(moduleKey === "cold" || moduleKey === "brand" || moduleKey === "trade") && state === "confirmed" && <button className="secondary-button record-trace-entry" onClick={onTrace}><FileTextIcon />查看关联追溯记录</button>}<div className="dual-action-bar"><button onClick={() => flash("已复制业务编号和脱敏摘要")}>复制摘要</button><button onClick={onManage}>返回我的管理</button></div><div className="boundary-note"><InfoCircledIcon /><p>如果成员停用、能力到期、字段冲突或对象被锁定，提交会停止并给出可恢复原因；历史经办人与原始快照不会被覆盖。</p></div></main>;
}

function RealNamePage({ action, onBack, onNext }: { action: string; onBack: () => void; onNext: () => void }) {
  return (
    <main className="flow-page">
      <SubHeader title="完成自然人实名" onBack={onBack} />
      <FlowIntro step="1 / 3" title="先确认是你本人" desc={`用于${action || "办理业务"}时确认责任人。实名不等于农户认证或组织认证。`} icon={IdCardIcon} />
      <section className="form-panel">
        <label className="form-field"><span>真实姓名</span><KeyboardInput placeholder="请输入本人真实姓名" defaultValue="王建国" /></label>
        <label className="form-field"><span>身份证号</span><KeyboardInput placeholder="请输入 18 位身份证号" defaultValue="420******0812" /></label>
        <label className="check-line"><span className="checked-box"><CheckCircledIcon /></span><span>我已阅读并同意实名核验授权，仅用于身份核验</span></label>
      </section>
      <div className="flow-foot"><button className="primary-button" onClick={onNext}>同意授权并继续<ChevronRightIcon /></button><p><LockClosedIcon />敏感信息加密保存，不在公开页面展示</p></div>
    </main>
  );
}

function ActorPage({ action, onBack, onFarmer, onOrg, onJoin, onInstitution }: { action: string; onBack: () => void; onFarmer: () => void; onOrg: () => void; onJoin: () => void; onInstitution: () => void }) {
  return (
    <main className="flow-page actor-page">
      <SubHeader title="请选择办理方式" onBack={onBack} />
      <FlowIntro step="2 / 3" title="这次由谁来办理？" desc={`用于${action || "后续业务"}。这不是永久身份选择，以后可建立或加入多个工作空间。`} icon={PersonIcon} />
      <section className="actor-options">
        <ActorOption icon={PersonIcon} title="建立我的农户档案" desc="我以个人农户身份开展农业生产经营" onClick={onFarmer} emphasized />
        <ActorOption icon={PlusIcon} title="创建组织工作空间" desc="我代表企业、合作社、登记家庭农场或服务机构" onClick={onOrg} />
        <ActorOption icon={IdCardIcon} title="加入已有组织" desc="我已经是某个组织的员工或成员" onClick={onJoin} />
        <ActorOption icon={LockClosedIcon} title="联系机构管理员开通" desc="我是政务、银行或平台运营人员" onClick={onInstitution} />
      </section>
      <p className="page-help"><InfoCircledIcon />一个账号可加入多个组织；每次业务只代表一个当前主体办理。</p>
    </main>
  );
}

function FarmerProfile({ step, onBack, onNext }: { step: number; onBack: () => void; onNext: () => void }) {
  return (
    <main className="flow-page farmer-setup-page">
      <SubHeader title="建立我的农户档案" onBack={onBack} />
      <div className="step-rail"><span className={step >= 1 ? "active" : ""}>经营区域</span><i /><span className={step >= 2 ? "active" : ""}>主要产业</span><i /><span className={step >= 3 ? "active" : ""}>确认档案</span></div>
      {step === 1 && <FlowIntro step="第 1 步" title="你主要在哪里经营？" desc="默认随州市，请按真实经营区域选择，不会直接使用手机定位代替。" icon={SewingPinIcon} />}
      {step === 2 && <FlowIntro step="第 2 步" title="你主要做什么？" desc="先选主要产业即可，品种、规模、地块或菇棚可在开始生产时再补。" icon={BackpackIcon} />}
      {step === 3 && <FlowIntro step="第 3 步" title="确认你的农户档案" desc="建档后状态为“本人声明/待经营核验”，不会显示为政府认证农户。" icon={CheckCircledIcon} />}
      <section className="form-panel compact">
        {step === 1 && <><SelectRow label="市" value="随州市" /><SelectRow label="区县" value="曾都区" /><SelectRow label="乡镇/街道" value="厉山镇" /><SelectRow label="村（可后补）" value="先不填写" /></>}
        {step === 2 && <div className="choice-grid"><button className="selected">随州香菇</button><button className="selected">随州香稻</button><button>其他粮油</button><button>果蔬</button><button>畜禽水产</button><button>其他</button></div>}
        {step === 3 && <div className="confirm-list"><div><span>实名姓名</span><strong>王建国</strong></div><div><span>经营区域</span><strong>随州市曾都区厉山镇</strong></div><div><span>主要产业</span><strong>随州香菇、随州香稻</strong></div><div><span>联系手机</span><strong>138****2286</strong></div><label className="check-line"><span className="checked-box"><CheckCircledIcon /></span><span>本人声明以上信息真实，并从事农业生产经营</span></label></div>}
      </section>
      <div className="not-required"><strong>本步不需要</strong><p>身份证照片、土地证、承包合同、全部地块、详细面积或金融材料。</p></div>
      <div className="flow-foot"><button className="primary-button" onClick={onNext}>{step < 3 ? "下一步" : "确认建档并继续"}<ChevronRightIcon /></button></div>
    </main>
  );
}

function FarmerSuccess({ action, onResume, onWorkbench }: { action: string; onResume: () => void; onWorkbench: () => void }) {
  return (
    <main className="result-page">
      <div className="result-ornament"><CheckCircledIcon /></div><small>农户档案已建立</small><h1>欢迎使用神农码</h1><p>当前状态：<b>本人声明 / 待经营核验</b></p>
      <section className="result-card"><div><span>农户主体</span><strong>王建国农户</strong></div><div><span>主体编号</span><strong>SN-SZ-F-000128</strong></div><div><span>已生效权益</span><strong>建立个人生产档案、发布基础农服需求</strong></div></section>
      <div className="boundary-note"><InfoCircledIcon /><p>建档不等于所有业务能力已开通。发布产品、申请品牌或金融服务时，会按动作补充对应材料。</p></div>
      <button className="primary-button" onClick={onResume}>{action ? `继续${action}` : "进入农户工作台"}<ChevronRightIcon /></button>
      <button className="secondary-button" onClick={onWorkbench}>先看看我的工作台</button>
    </main>
  );
}

function FarmDemand({ step, selectedType, onSelectType, onBack, onNext }: { step: number; selectedType: string; onSelectType: (value: string) => void; onBack: () => void; onNext: () => void }) {
  const copy = [
    ["需要什么服务？", "先选一个最接近的服务，详细要求可在后面用语音或文字补充。"],
    ["在哪里作业？", "已自动带入农户经营区域，你只需确认本次作业位置。"],
    ["希望什么时候完成？", "填写时间窗口和大概规模即可，服务方后续补专业数据。"],
    ["确认并发布需求", "发布后服务方可联系或提交方案；平台一期不收款、不结算。"],
  ][step - 1];
  return (
    <main className="flow-page demand-page">
      <SubHeader title="发布农事需求" onBack={onBack} />
      <div className="simple-progress"><span style={{ width: `${step * 25}%` }} /></div>
      <FlowIntro step={`${step} / 4`} title={copy[0]} desc={copy[1]} icon={step === 4 ? CheckCircledIcon : BackpackIcon} />
      <section className="form-panel compact">
        {step === 1 && <div className="choice-grid farm-types">{farmTypes.map((item) => <button key={item} className={selectedType === item ? "selected" : ""} onClick={() => onSelectType(item)}>{item}</button>)}</div>}
        {step === 2 && <><SelectRow label="生产对象" value="随州香稻 · 2026 夏季" /><SelectRow label="作业区域" value="随州市曾都区厉山镇" /><SelectRow label="具体位置" value="王家湾 2 号地块" /><button className="voice-add"><PaperPlaneIcon /><span><strong>用语音补充位置</strong><small>识别后会先让你确认，不会直接提交</small></span></button></>}
        {step === 3 && <><SelectRow label="期望开始" value="2026-08-18" /><SelectRow label="最晚完成" value="2026-08-22" /><label className="form-field"><span>大概规模</span><KeyboardInput inputMode="decimal" placeholder="例如 80 亩" defaultValue="80 亩" /></label><button className="voice-add"><PaperPlaneIcon /><span><strong>说出其他要求</strong><small>例如：地块较软，希望使用履带式收割机</small></span></button></>}
        {step === 4 && <div className="confirm-list"><div><span>服务类型</span><strong>{selectedType}</strong></div><div><span>生产对象</span><strong>随州香稻 · 2026 夏季</strong></div><div><span>作业区域</span><strong>曾都区厉山镇 · 王家湾 2 号地块</strong></div><div><span>时间与规模</span><strong>8月18—22日 · 约80亩</strong></div><div><span>发布主体</span><strong>王建国农户</strong></div><label className="check-line"><span className="checked-box"><CheckCircledIcon /></span><span>确认需求真实；服务安排、现场结果和验收将分阶段记录</span></label></div>}
      </section>
      <div className="progressive-note"><ClockIcon /><span><strong>少填也能发布</strong><small>现在只收集 P0 需求字段，机具、人员、实际用量和现场凭证由服务方履约时补充。</small></span></div>
      <div className="flow-foot"><button className="primary-button" onClick={onNext}>{step < 4 ? "下一步" : "确认发布需求"}<ChevronRightIcon /></button></div>
    </main>
  );
}

function FarmerWorkbench({ hasPending, onBack, openModule, onDemand, onFarmManagement, onProduction, onPendingService, onBatches, onTrace, onDemo, flash }: { hasPending: boolean; onBack: () => void; openModule: (key: ModuleKey) => void; onDemand: () => void; onFarmManagement: () => void; onProduction: () => void; onPendingService: () => void; onBatches: () => void; onTrace: (action: TraceAction) => void; onDemo: () => void; flash: (message: string) => void }) {
  return (
    <main className="workbench-page">
      <section className="workbench-hero"><img src="/assets/shennong/hero-landscape.png" alt="随州农业产业" draggable={false} /><div className="workbench-shade" /><button className="workbench-back" onClick={onBack}><ArrowLeftIcon /></button><div><small>本人农户 · 本人声明</small><h1>王建国农户</h1><p>随州香菇、随州香稻 · 曾都区厉山镇</p></div><button className="switch-link" onClick={onDemo}>演示模式</button></section>
      <section className="workbench-body">
        {hasPending ? <button className="next-task" onClick={() => onTrace("harvest")}><span><small>下一步提醒 · 今天</small><strong>补充春季香菇批次采收记录</strong><em>厉山镇 1 号菇棚 · 还差采收数量</em></span><ChevronRightIcon /></button> : <button className="next-task no-pending" onClick={() => onTrace("start")}><span><small>工作台</small><strong>今天没有必须处理的事情</strong><em>可以开始新一季/一批，或继续记录真实生产</em></span><ChevronRightIcon /></button>}
        <div className="big-actions trace-action-grid"><button onClick={() => onTrace("start")}><PlusIcon /><strong>开始一季/一批</strong><small>建立生产周期</small></button><button onClick={() => onTrace("record")}><ClipboardIcon /><strong>记一次农事</strong><small>语音或拍照记录</small></button><button onClick={() => onTrace("harvest")}><TargetIcon /><strong>我要采收</strong><small>生成采收批次</small></button><button onClick={onBatches}><IdCardIcon /><strong>我的批次</strong><small>查看追溯状态</small></button></div>
        <div className="section-heading"><div><span>{hasPending ? "今日待办" : "工作台状态"}</span><small>{hasPending ? "2 项需要处理" : "数据截至 11:10"}</small></div>{hasPending && <button onClick={() => flash("查看全部待办")}>查看<ChevronRightIcon /></button>}</div>
        {hasPending ? <div className="task-strip"><button onClick={onPendingService}><span className="task-state warning">待确认</span><span><strong>确认收割服务已完成</strong><small>服务安排 NF-20260814-016</small></span><ChevronRightIcon /></button><button onClick={() => onTrace("harvest")}><span className="task-state">待补充</span><span><strong>补一张香菇采收现场照片</strong><small>春季香菇 · 第 3 批</small></span><ChevronRightIcon /></button></div> : <div className="empty-work-state"><CheckCircledIcon /><span><strong>全部处理完成</strong><small>这里不会为了展示而制造虚假待办</small></span></div>}
        <div className="section-heading"><div><span>我的生产</span><small>数据按来源真实记录</small></div></div>
        <div className="production-card"><div><span className="production-glyph"><FileTextIcon /></span><span><small>当前生产周期</small><strong>随州香稻 · 2026 夏季</strong><em>最近农事：8月10日植保作业</em></span><button onClick={onProduction}>查看</button></div><p>目前记录已经能说明“种在哪里、做过什么”，采收时再补数量和质量材料。</p></div>
        <div className="section-heading"><div><span>找服务</span><small>按当前生产需要推荐</small></div></div>
        <div className="work-service-grid"><button onClick={() => openModule("farm")}><BackpackIcon /><span><strong>找农事</strong><small>收割、烘干等</small></span></button><button onClick={() => flash("进入农资公开资源") }><CubeIcon /><span><strong>找农资</strong><small>种子、肥料等</small></span></button><button onClick={() => flash("进入政府农技人员名单") }><PersonIcon /><span><strong>问农技</strong><small>公开农技名录</small></span></button><button onClick={() => openModule("cold")}><GlobeIcon /><span><strong>找冷链</strong><small>冷库与运输</small></span></button></div>
        <button className="my-farm-service-entry" onClick={onFarmManagement}><ClipboardIcon /><span><strong>我的农服</strong><small>查看需求、服务安排、完成结果与我的资源</small></span><em>2项</em><ChevronRightIcon /></button>
        <button className="publish-demand-banner" onClick={onDemand}><PlusIcon /><span><strong>没有合适的？发布定制需求</strong><small>沿用查找条件，只补地点、时间和大概规模</small></span><ChevronRightIcon /></button>
      </section>
    </main>
  );
}

function OrgSetup({ step, onBack, onNext }: { step: "search" | "create"; onBack: () => void; onNext: () => void }) {
  return (
    <main className="flow-page">
      <SubHeader title="创建组织工作空间" onBack={onBack} />
      <FlowIntro step={step === "search" ? "先查重" : "创建受限空间"} title={step === "search" ? "先看看组织是否已存在" : "准备组织工作空间"} desc={step === "search" ? "避免同一企业或合作社重复建档。查到已有主体时，应申请加入。" : "当前只收集准备认证所需的最少信息，正式经营业务需认证后开通。"} icon={step === "search" ? MagnifyingGlassIcon : PlusIcon} />
      <section className="form-panel compact">
        {step === "search" ? <><label className="form-field"><span>统一社会信用代码/登记号（有则优先）</span><KeyboardInput placeholder="请输入代码或登记号" /></label><label className="form-field"><span>组织名称关键词</span><KeyboardInput placeholder="例如：随州丰禾农业" defaultValue="随州丰禾农业" /></label><SelectRow label="登记区域" value="随州市" /></> : <><label className="form-field"><span>空间名称</span><KeyboardInput defaultValue="随州丰禾农业工作空间" /></label><SelectRow label="自报组织类别" value="农业企业" /><SelectRow label="主要经营区域" value="随州市曾都区" /><SelectRow label="本人与组织关系" value="负责人" /><SelectRow label="拟开展业务（至少1项）" value="生产、加工、品牌" /><label className="check-line"><span className="checked-box"><CheckCircledIcon /></span><span>同意工作空间创建与认证准备协议</span></label></>}
      </section>
      {step === "search" && <div className="search-result-empty"><CheckCircledIcon /><span><strong>未发现完全一致的正式主体</strong><small>仍需在正式认证时通过登记信息再次查重</small></span></div>}
      <div className="flow-foot"><button className="primary-button" onClick={onNext}>{step === "search" ? "继续创建工作空间" : "创建未认证受限空间"}<ChevronRightIcon /></button></div>
    </main>
  );
}

function JoinOrg({ onBack, onSubmit }: { onBack: () => void; onSubmit: () => void }) {
  return (
    <main className="flow-page"><SubHeader title="加入已有组织" onBack={onBack} /><FlowIntro step="成员申请" title="查找你所在的组织" desc="一个账号可以加入多家企业。离职或被禁用后，组织数据仍归组织，你的个人账号不受影响。" icon={IdCardIcon} /><section className="form-panel compact"><label className="form-field"><span>组织名称或统一社会信用代码</span><KeyboardInput defaultValue="随州丰禾农业有限公司" /></label><SelectRow label="我与组织的关系" value="员工" /><SelectRow label="申请岗位" value="综合业务人员" /><label className="form-field"><span>申请说明（可选）</span><KeyboardInput placeholder="向管理员说明你的工作内容" defaultValue="负责生产记录和品牌材料" /></label></section><div className="org-match"><span className="org-logo"><GlobeIcon /></span><span><strong>湖北随州丰禾农业有限公司</strong><small>统一社会信用代码：9142**********281X</small><em>已认证 · 曾都区</em></span></div><div className="flow-foot"><button className="primary-button" onClick={onSubmit}>提交加入申请<ChevronRightIcon /></button><p><LockClosedIcon />需组织管理员确认后才获得业务权限</p></div></main>
  );
}

function InstitutionOpen({ onBack }: { onBack: () => void }) {
  return (
    <main className="flow-page"><SubHeader title="机构角色开通" onBack={onBack} /><FlowIntro step="非自助认证" title="请联系所属机构管理员" desc="政务、银行和平台运营角色涉及机构授权，不能由个人在小程序中自行选择。" icon={LockClosedIcon} /><section className="institution-list"><div><span><GlobeIcon /></span><strong>政务人员</strong><p>由市、区县、镇街等政务组织管理员按区域与职责开通。</p></div><div><span><IdCardIcon /></span><strong>银行人员</strong><p>由已接入银行管理员开通，只能查看本行获授权的申请。</p></div><div><span><DashboardIcon /></span><strong>运营人员</strong><p>由租户授权的运营管理员开通，权限有范围和有效期。</p></div></section><div className="boundary-note"><InfoCircledIcon /><p>若机构尚未接入，请由机构负责人联系神农码项目运营方完成组织接入和管理员核验。</p></div></main>
  );
}

function RestrictedSpace({ onHome, onStartAuth, flash }: { onHome: () => void; onStartAuth: () => void; flash: (message: string) => void }) {
  return (
    <main className="restricted-page"><div className="result-ornament restricted"><LockClosedIcon /></div><small>工作空间创建成功</small><h1>当前为未认证受限空间</h1><p>随州丰禾农业工作空间</p><section className="restricted-list"><div className="allowed"><CheckCircledIcon /><span><strong>现在可以做</strong><small>查看认证引导、准备材料、查看 PC 后台地址和帮助</small></span></div><div><LockClosedIcon /><span><strong>认证前不能做</strong><small>创建产品/批次、发布资源、管理正式成员、生成公众码或申请金融</small></span></div></section><button className="primary-button" onClick={onStartAuth}>开始组织认证</button><button className="pc-entry" onClick={() => flash("PC 后台仅开放认证准备模块")}><DesktopIcon /><span><strong>在电脑继续准备</strong><small>pc.shennongma.cn · 手机号为同一账号</small></span><ChevronRightIcon /></button><button className="text-button" onClick={onHome}>先回到“我的”</button></main>
  );
}

function FilterSheet({ onApply }: { onApply: () => void }) {
  return <div className="filter-sheet-content">
    <div className="filter-group"><strong>距离范围</strong><div><button>5km内</button><button className="selected">10km内</button><button>30km内</button><button>全市</button></div></div>
    <div className="filter-group"><strong>用户评价</strong><small>仅统计已确认履约并展示样本数</small><div><button>不限</button><button className="selected">4.5分以上</button><button>4.0分以上</button></div></div>
    <div className="filter-group"><strong>参考费用</strong><small>不是平台成交价，默认不按最低价排序</small><div><button className="selected">不限</button><button>100元/亩内</button><button>按吨</button><button>面议</button></div></div>
    <div className="filter-group"><strong>更多条件</strong><div><button className="selected">能力材料有效</button><button>政府推荐</button><button>近7天可接洽</button><button>机构提供方</button></div></div>
    <div className="sheet-actions"><button>重置</button><button className="primary-button" onClick={onApply}>查看筛选结果</button></div>
  </div>;
}

function DemoScenarioSheet({ current, onSelect }: { current: DemoScenario; onSelect: (scenario: DemoScenario) => void }) {
  const scenarios: { key: DemoScenario; title: string; desc: string; icon: IconType }[] = [
    { key: "farmer-pending", title: "农户 · 有待办", desc: "查看待办入口与三项溯源记录", icon: PersonIcon },
    { key: "farmer-empty", title: "农户 · 无待办", desc: "首页显示“工作台”，不制造虚假任务", icon: CheckCircledIcon },
    { key: "org-admin", title: "组织 · 主体管理员", desc: "认证、成员、能力和 PC 管理入口", icon: DashboardIcon },
    { key: "org-business", title: "组织 · 业务人员", desc: "按权限包查看现场任务和本人待办", icon: ClipboardIcon },
    { key: "org-viewer", title: "组织 · 查看人员", desc: "只读查看获授权范围，不显示办理按钮", icon: LockClosedIcon },
    { key: "gov-staff", title: "政务 · 工作人员", desc: "预览辖区摘要、监管扫码和本人工单；真实账号由PC开通", icon: GlobeIcon },
    { key: "bank-staff", title: "银行 · 业务人员", desc: "只处理本行获授权服务意向、联系记录与公开状态", icon: IdCardIcon },
    { key: "ops-staff", title: "运营 · 值守人员", desc: "预览本人待办、运行摘要和交班；真实账号由PC授权", icon: ReaderIcon },
  ];
  return <div className="demo-scenario-list"><div className="demo-warning"><InfoCircledIcon />仅改变前端模拟数据，不改变真实账号、主体、成员关系或权限。政务、银行、运营的真实机构与首位管理员必须先在 PC 端预置或授权。</div>{scenarios.map(({ key, title, desc, icon: Icon }) => <button key={key} className={current === key ? "selected" : ""} onClick={() => onSelect(key)}><span><Icon /></span><div><strong>{title}</strong><small>{desc}</small></div>{current === key ? <CheckCircledIcon /> : <ChevronRightIcon />}</button>)}</div>;
}

function ProviderApply({ onBack, onContinue }: { onBack: () => void; onContinue: () => void }) {
  return <main className="flow-page"><SubHeader title="成为服务提供方" onBack={onBack} /><FlowIntro step="能力申请" title="你准备提供哪类服务？" desc="成为服务方是能力申请，不会把个人账号永久切换为另一种身份。" icon={BackpackIcon} /><section className="provider-paths"><div><span><PersonIcon /></span><strong>个人农户/家庭农场</strong><p>可申请低风险、允许个人提供的农机或技能服务；按项目核验权属、操作人员、证照、检验和保险。</p><button onClick={onContinue}>查看个人可申请类别<ChevronRightIcon /></button></div><div><span><GlobeIcon /></span><strong>企业或农服机构</strong><p>先完成组织认证，再开通农服能力；可使用 PC 批量维护服务资源、设备和人员。</p><button onClick={onContinue}>进入组织认证与能力清单<ChevronRightIcon /></button></div></section><div className="boundary-note"><InfoCircledIcon /><p>农事、农资和农技使用不同准入材料。展示服务前仍需通过对应主体和能力检查。</p></div></main>;
}

function TraceStartPage({ onBack, onSubmit }: { onBack: () => void; onSubmit: () => void }) {
  return <main className="flow-page trace-form-page"><SubHeader title="开始一季/一批" onBack={onBack} /><FlowIntro step="建立生产周期" title="从真实生产开始记录" desc="只填本次开始生产需要的核心信息，主体、区域、负责人和编号由系统生成。" icon={PlusIcon} /><section className="form-panel compact"><SelectRow label="地块/菇棚" value="王家湾 2 号地块 · 80亩" /><div className="field-choice"><small>生产类型</small><div><button className="selected">随州香稻</button><button>随州香菇</button></div></div><SelectRow label="开始日期" value="2026-08-14（今天）" /><label className="form-field"><span>面积或菌棒数量</span><KeyboardInput inputMode="decimal" defaultValue="80亩" /></label><button className="evidence-row"><CameraIcon /><span><small>品种/菌棒来源（可后补）</small><strong>扫码、拍单据或语音说明</strong></span><ChevronRightIcon /></button></section><div className="system-generated"><FileTextIcon /><span><strong>系统将自动生成</strong><small>周期名称、年度、负责人、周期编号和香稻生产事件模板</small></span></div><div className="flow-foot"><button className="primary-button" onClick={onSubmit}>确认开始生产<ChevronRightIcon /></button></div></main>;
}

function TraceRecordPage({ onBack, onSubmit }: { onBack: () => void; onSubmit: () => void }) {
  const [eventType, setEventType] = useState("用药");
  return <main className="flow-page trace-form-page"><SubHeader title="记一次农事" onBack={onBack} /><FlowIntro step="快速记录" title="今天做了什么？" desc="可以点选，也可以说一句话。语音只生成草稿，提交前必须确认。" icon={ClipboardIcon} /><section className="form-panel compact"><SelectRow label="生产周期" value="随州香稻 · 2026 夏季" /><div className="field-choice"><small>事件类型</small><div>{["施肥", "用药", "农服作业", "其他"].map(item => <button key={item} className={eventType === item ? "selected" : ""} onClick={() => setEventType(item)}>{item}</button>)}</div></div><SelectRow label="发生时间" value="2026-08-14 10:30" />{(eventType === "用药" || eventType === "施肥") && <><label className="form-field"><span>投入品名称</span><KeyboardInput defaultValue={eventType === "用药" ? "阿维菌素" : "复合肥"} /></label><div className="inline-fields"><label className="form-field"><span>用量</span><KeyboardInput inputMode="decimal" defaultValue="2" /></label><SelectRow label="单位" value={eventType === "用药" ? "瓶" : "公斤"} /></div><div className="risk-confirm"><InfoCircledIcon /><span><strong>高风险字段需再次确认</strong><small>投入品名称、用量和单位不会由语音结果自动提交</small></span></div></>}<button className="evidence-row"><CameraIcon /><span><small>现场证据</small><strong>{eventType === "用药" ? "至少上传1张标签/现场照片" : "拍照或稍后补充"}</strong></span><ChevronRightIcon /></button><button className="voice-add"><PaperPlaneIcon /><span><strong>按住说一句</strong><small>示例：昨天给二号地打了阿维菌素，用了两瓶</small></span></button></section><label className="trace-confirm-line"><CheckCircledIcon /><span>我已核对生产对象、时间、投入品和用量</span></label><div className="flow-foot"><button className="primary-button" onClick={onSubmit}>确认保存记录<ChevronRightIcon /></button></div></main>;
}

function TraceHarvestPage({ onBack, onSubmit }: { onBack: () => void; onSubmit: () => void }) {
  return <main className="flow-page trace-form-page"><SubHeader title="我要采收" onBack={onBack} /><FlowIntro step="形成采收批次" title="这次采收了多少？" desc="采收会生成第一批拥有数量的农产品批次，后续追溯和流转都从这里开始。" icon={TargetIcon} /><section className="form-panel compact"><SelectRow label="生产周期" value="随州香菇 · 春季第3批" /><SelectRow label="采收时间" value="2026-08-14 10:40" /><div className="inline-fields"><label className="form-field"><span>采收数量</span><KeyboardInput inputMode="decimal" defaultValue="300" /></label><SelectRow label="单位" value="斤" /></div><SelectRow label="产品形态" value="鲜香菇" /><SelectRow label="等级（可选）" value="一级" /><button className="evidence-row"><CameraIcon /><span><small>采收照片</small><strong>已上传 1 张 · 弱网可稍后同步</strong></span><ChevronRightIcon /></button></section><div className="system-generated"><TargetIcon /><span><strong>提交后自动生成采收批次</strong><small>记录原始数量、批次编号、来源周期和当前追溯状态</small></span></div><div className="flow-foot"><button className="primary-button" onClick={onSubmit}>确认记录采收<ChevronRightIcon /></button></div></main>;
}

function TraceResultPage({ kind, onWorkbench, onContinue }: { kind: TraceAction; onWorkbench: () => void; onContinue: () => void }) {
  const result = kind === "start" ? { small: "生产周期已建立", title: "随州香稻 · 2026 夏季", desc: "周期编号 SN-CY-20260814-028", rows: [["生产单元", "王家湾2号地块 · 80亩"], ["开始日期", "2026-08-14"], ["下一步", "记录第一次农事"]], action: "查看生产时间线" } : kind === "record" ? { small: "农事记录已保存", title: "用药记录已进入时间线", desc: "记录编号 SN-EV-20260814-116", rows: [["生产周期", "随州香稻 · 2026 夏季"], ["发生时间", "2026-08-14 10:30"], ["数据来源", "本人确认 · 语音/手工辅助"]], action: "查看生产时间线" } : { small: "采收记录已完成", title: "已记录300斤鲜香菇", desc: "采收批次 SN-HV-20260814-036", rows: [["来源周期", "随州香菇 · 春季第3批"], ["原始数量", "300斤"], ["追溯状态", "私有记录 · 待质量材料"]], action: "查看采收批次" };
  return <main className="result-page trace-result-page"><div className="result-ornament"><CheckCircledIcon /></div><small>{result.small}</small><h1>{result.title}</h1><p>{result.desc}</p><section className="result-card">{result.rows.map(([label,value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}</section><div className="boundary-note"><InfoCircledIcon /><p>{kind === "harvest" ? "生成采收批次不等于产品已经公开、质量合格或完成销售；补齐适用材料后再生成公众追溯码。" : "记录保留实际操作者和来源。后续更正生成版本，不覆盖原始事实。"}</p></div><button className="primary-button" onClick={onContinue}>{result.action}<ChevronRightIcon /></button><button className="secondary-button" onClick={onWorkbench}>返回农户工作台</button></main>;
}

function TraceCenter({ onBack, onCycle, onBatches, onTrace }: { onBack: () => void; onCycle: () => void; onBatches: () => void; onTrace: (action: TraceAction) => void }) {
  return <main className="trace-center-page core-list-page"><SubHeader title="我的生产" onBack={onBack} />
    <section className="trace-owner-strip"><span><PersonIcon /></span><div><small>当前记录主体 · 本人农户</small><strong>王建国农户</strong><em>本人声明 · 不等于政府认证</em></div></section>
    <section className="trace-overview-card"><div><small>在产周期</small><strong>2</strong></div><div><small>本季事件</small><strong>9</strong></div><div><small>采收批次</small><strong>3</strong></div><div><small>待补材料</small><strong>1</strong></div></section>
    <div className="trace-center-actions"><button onClick={() => onTrace("start")}><PlusIcon /><span><strong>开始一季/一批</strong><small>建立生产周期</small></span></button><button onClick={() => onTrace("record")}><ClipboardIcon /><span><strong>记一次农事</strong><small>语音、拍照辅助</small></span></button><button onClick={() => onTrace("harvest")}><TargetIcon /><span><strong>我要采收</strong><small>生成采收批次</small></span></button><button onClick={onBatches}><IdCardIcon /><span><strong>我的批次</strong><small>查看公开状态</small></span></button></div>
    <div className="section-heading"><div><span>当前生产周期</span><small>完整度与质量结论分开显示</small></div></div>
    <section className="cycle-card-list"><button onClick={onCycle}><div><span className="status-pill live">生产中</span><small>SN-CY-20260318-006</small></div><strong>随州香稻 · 2026夏季</strong><p>王家湾2号地块 · 80亩 · 3月18日开始</p><footer><span>记录完整度 72%</span><em>最近：8月14日收割服务<ChevronRightIcon /></em></footer></button><button onClick={onCycle}><div><span className="status-pill live">采收中</span><small>SN-CY-20260205-012</small></div><strong>随州香菇 · 春季第3批</strong><p>厉山镇1号菇棚 · 12,000棒 · 2月5日开始</p><footer><span>记录完整度 86%</span><em>已生成2个批次<ChevronRightIcon /></em></footer></button></section>
    <section className="recent-trace-list"><div className="card-title"><strong>最近记录</strong><small>不可覆盖原始事实</small></div><div><span><BackpackIcon /></span><p><strong>水稻机械收割服务</strong><small>服务方提交 · 双方已确认 · 已引用</small></p><em>8月14日</em></div><div><span><ClipboardIcon /></span><p><strong>用药记录：阿维菌素</strong><small>本人确认 · 现场照片1张</small></p><em>8月10日</em></div><div><span><TargetIcon /></span><p><strong>鲜香菇采收 300斤</strong><small>本人确认 · 已生成采收批次</small></p><em>8月8日</em></div></section>
    <div className="boundary-note"><InfoCircledIcon /><p>“记录完整度”只表示应填事实和证据的完成程度，不代表产品质量合格。质量状态必须展示检测、合格证或主体控制等具体来源。</p></div>
  </main>;
}

function TraceCycleDetail({ onBack, onRecord, onHarvest, onBatches, onFarmService }: { onBack: () => void; onRecord: () => void; onHarvest: () => void; onBatches: () => void; onFarmService: () => void }) {
  return <main className="core-detail-page trace-cycle-page"><SubHeader title="生产周期详情" onBack={onBack} />
    <section className="detail-hero-card trace-cycle-hero"><div className="detail-kicker"><span className="status-pill live">生产中</span><em>SN-CY-20260318-006</em></div><h1>随州香稻 · 2026夏季</h1><p>王家湾2号地块 · 80亩 · 2026-03-18开始</p><div className="detail-status-row"><span><FileTextIcon />记录完整度 72%</span><span><ClockIcon />最近更新 8月14日</span></div></section>
    <section className="detail-section-card"><div className="card-title"><strong>周期核心字段</strong><small>系统快照</small></div><div className="detail-field-list"><div><span>记录主体</span><strong>王建国农户</strong></div><div><span>生产单元</span><strong>王家湾2号地块 · 80亩</strong></div><div><span>品种来源</span><strong>鄂香2号 · 购种单据已引用</strong></div><div><span>当前阶段</span><strong>成熟采收期</strong></div><div><span>累计采收</span><strong>0 · 尚未形成香稻采收批次</strong></div></div></section>
    <section className="trace-event-timeline"><div className="card-title"><strong>生产时间线</strong><small>6条已记录</small></div><button className="service-event" onClick={onFarmService}><i><BackpackIcon /></i><span><small>2026-08-14 · 农服作业</small><strong>水稻机械收割服务</strong><em>服务方提交 · 双方确认 · 关联资源V3</em></span><ChevronRightIcon /></button><div><i><ClipboardIcon /></i><span><small>2026-08-10 · 植保</small><strong>阿维菌素 · 2瓶</strong><em>本人确认 · 标签/现场照片1张</em></span></div><div><i><TargetIcon /></i><span><small>2026-06-02 · 田间管理</small><strong>第一次施肥</strong><em>本人语音草稿后确认 · 复合肥40kg</em></span></div><div><i><PlusIcon /></i><span><small>2026-03-18 · 周期开始</small><strong>建立香稻生产周期</strong><em>本人建档 · 地块档案引用</em></span></div></section>
    <div className="trace-detail-actions"><button onClick={onRecord}><ClipboardIcon />记一次农事</button><button onClick={onHarvest}><TargetIcon />我要采收</button><button onClick={onBatches}><IdCardIcon />查看批次</button></div>
    <div className="boundary-note"><InfoCircledIcon /><p>更正记录会新增版本并说明原因，不覆盖原始操作者、时间、数据来源或业务快照。</p></div>
  </main>;
}

function TraceBatches({ onBack, onBatch }: { onBack: () => void; onBatch: (batch: TraceBatchKey) => void }) {
  return <main className="core-list-page trace-batches-page"><SubHeader title="我的批次" onBack={onBack} />
    <section className="batch-status-summary"><span className="active">全部 3</span><span>待补材料 1</span><span>公众码 1</span></section>
    <section className="owned-card-list batch-card-list"><button onClick={() => onBatch("mushroom")}><div><span className="status-pill done">公众码已激活</span><small>SN-HV-20260808-036</small></div><strong>鲜香菇 · 春季第3批</strong><p>8月8日采收 · 原始300斤 · 当前剩余260斤</p><div className="batch-evidence-row"><span>主体质量控制</span><span>生产主体合格证</span><span>风险正常</span></div><footer><span>公众版本 V2 · 8月14日更新</span><em>查看批次<ChevronRightIcon /></em></footer></button><button onClick={() => onBatch("rice")}><div><span className="status-pill warning">待补质量材料</span><small>SN-HV-20260814-041</small></div><strong>香稻谷 · 2026夏季首批</strong><p>8月14日采收 · 原始5,200斤 · 尚未公开</p><div className="batch-evidence-row"><span>来源周期已关联</span><span>采收照片2张</span></div><footer><span>公众码待生成</span><em>查看缺项<ChevronRightIcon /></em></footer></button></section>
    <div className="boundary-note"><InfoCircledIcon /><p>批次记录原始数量、已确认流出和剩余量；线下销售不在溯源模块记录价格、订单或结算。</p></div>
  </main>;
}

function TraceBatchDetail({ batch, onBack, onPublic, flash }: { batch: TraceBatchKey; onBack: () => void; onPublic: () => void; flash: (message: string) => void }) {
  const mushroom = batch === "mushroom";
  return <main className="core-detail-page batch-detail-page"><SubHeader title="批次详情" onBack={onBack} />
    <section className="detail-hero-card batch-detail-hero"><div className="detail-kicker"><span className={`status-pill ${mushroom ? "done" : "warning"}`}>{mushroom ? "公众码已激活" : "待补质量材料"}</span><em>{mushroom ? "SN-HV-20260808-036" : "SN-HV-20260814-041"}</em></div><h1>{mushroom ? "鲜香菇 · 春季第3批" : "香稻谷 · 2026夏季首批"}</h1><p>{mushroom ? "来源：厉山镇1号菇棚" : "来源：王家湾2号地块"}</p></section>
    <section className="quantity-ledger"><span><small>原始数量</small><strong>{mushroom ? "300斤" : "5,200斤"}</strong></span><span><small>已确认流出</small><strong>{mushroom ? "40斤" : "0斤"}</strong></span><span><small>当前剩余</small><strong>{mushroom ? "260斤" : "5,200斤"}</strong></span></section>
    <section className="detail-section-card"><div className="card-title"><strong>批次与来源</strong><small>事实链</small></div><div className="detail-field-list"><div><span>采收时间</span><strong>{mushroom ? "2026-08-08 07:30" : "2026-08-14 16:40"}</strong></div><div><span>产品形态</span><strong>{mushroom ? "鲜香菇 · 一级" : "原粮稻谷 · 待分级"}</strong></div><div><span>来源周期</span><strong>{mushroom ? "随州香菇 · 春季第3批" : "随州香稻 · 2026夏季"}</strong></div><div><span>记录主体</span><strong>王建国农户 · 本人确认</strong></div></div></section>
    <section className="detail-section-card"><div className="card-title"><strong>质量与合格证</strong><small>按来源展示</small></div><div className="evidence-list">{mushroom ? <><div><CheckCircledIcon /><span><strong>主体质量控制记录</strong><small>采收卫生检查、外观分级 · 来源：生产主体</small></span></div><div><CheckCircledIcon /><span><strong>承诺达标合格证</strong><small>签发主体：王建国农户 · 不等于政府认证或机构检测</small></span></div></> : <><div><ClockIcon /><span><strong>质量材料待补</strong><small>当前只有采收照片，不能展示为质量合格</small></span></div><div><InfoCircledIcon /><span><strong>承诺达标合格证不按当前国家强制范围套用</strong><small>香稻原粮需按主管部门确认的地方规则处理</small></span></div></>}</div></section>
    {mushroom ? <button className="page-primary-entry" onClick={onPublic}><GlobeIcon />预览公众追溯页</button> : <button className="page-primary-entry" onClick={() => flash("进入质量材料补充：检测/主体控制材料需标明来源") }><PlusIcon />补充质量材料</button>}
    <button className="secondary-page-entry" onClick={() => flash("批次码已保存；扫码仍校验当前有效状态")}><IdCardIcon />保存批次码</button>
    <div className="boundary-note"><InfoCircledIcon /><p>公众追溯只投影可公开的生产事实、质量证据来源和状态，不展示价格、销售对象、订单、手机号或精确地块坐标。</p></div>
  </main>;
}

function TracePublic({ batch, onBack, flash }: { batch: TraceBatchKey; onBack: () => void; flash: (message: string) => void }) {
  const mushroom = batch === "mushroom";
  return <main className="public-trace-page"><SubHeader title="公众追溯" onBack={onBack} />
    <section className="public-trace-hero"><small>神农码 · 公众批次页</small><h1>{mushroom ? "随州鲜香菇" : "随州香稻谷"}</h1><p>{mushroom ? "春季第3批 · 公众版本 V2" : "2026夏季首批 · 尚未公开"}</p><span><CheckCircledIcon />{mushroom ? "追溯码当前有效" : "仅预览，不可对外使用"}</span></section>
    <section className="public-subject-card"><span><PersonIcon /></span><div><small>生产主体</small><strong>王建国农户</strong><em>本人声明 · 随州市曾都区厉山镇</em></div><button onClick={() => flash("查看主体公开身份与状态说明")}>主体码</button></section>
    <section className="public-fact-grid"><div><small>采收时间</small><strong>{mushroom ? "2026-08-08" : "2026-08-14"}</strong></div><div><small>产品形态</small><strong>{mushroom ? "鲜香菇" : "原粮稻谷"}</strong></div><div><small>公开数量口径</small><strong>{mushroom ? "该采收批次300斤" : "尚未公开"}</strong></div><div><small>风险状态</small><strong>{mushroom ? "未见待处置风险" : "材料待补"}</strong></div></section>
    <section className="public-trace-timeline"><div className="card-title"><strong>从生产到采收</strong><small>按事件来源展示</small></div><div><i><TargetIcon /></i><span><small>8月8日</small><strong>采收鲜香菇300斤</strong><em>来源：生产主体确认 · 现场照片</em></span></div><div><i><BackpackIcon /></i><span><small>7月28日</small><strong>菇棚消毒服务完成</strong><em>来源：服务方提交 · 双方确认</em></span></div><div><i><ClipboardIcon /></i><span><small>6月12日</small><strong>出菇期管理记录</strong><em>来源：生产主体确认</em></span></div><div><i><PlusIcon /></i><span><small>2月5日</small><strong>建立生产周期</strong><em>来源：主体档案与生产单元</em></span></div></section>
    <section className="public-quality-card"><div className="card-title"><strong>质量说明</strong><small>不混淆来源</small></div><div><CheckCircledIcon /><span><strong>主体质量控制</strong><small>生产主体记录采收卫生与外观分级</small></span></div><div><FileTextIcon /><span><strong>承诺达标合格证</strong><small>签发方：生产主体 · 证号尾号 0236 · 当前有效</small></span></div><p>以上不等于政府背书或第三方检测；若存在检测报告，将单独展示机构与报告编号。</p></section>
    <div className="public-version-note"><ClockIcon />数据截至2026-08-14 17:20 · 公众版本V2 · 历史版本可审计</div>
    <button className="secondary-page-entry" onClick={() => flash("已生成脱敏分享卡片") }><Share1Icon />分享追溯信息</button>
  </main>;
}

function WorkspaceCenter({ current, membershipStage, activatedRole, activatedCapabilities, onBack, onSelect, onCreate, onJoin, onInstitution, onInvite, onPending, onProduct, flash }: { current: DemoScenario; membershipStage: MembershipStage; activatedRole: "业务人员" | "查看人员"; activatedCapabilities: string[]; onBack: () => void; onSelect: (scenario: DemoScenario) => void; onCreate: () => void; onJoin: () => void; onInstitution: () => void; onInvite: () => void; onPending: () => void; onProduct: () => void; flash: (message: string) => void }) {
  const currentMeta = workspaceMeta[current];
  const farmerScenario: DemoScenario = current.startsWith("farmer-") ? current : "farmer-pending";
  const spaces: { scenario: DemoScenario; icon: IconType; permission: string; tone: string }[] = [
    { scenario: farmerScenario, icon: PersonIcon, permission: "生产记录、农服需求、本人批次", tone: "farmer" },
    { scenario: "org-admin", icon: DashboardIcon, permission: "主体、成员及已开通能力管理", tone: "enterprise" },
    { scenario: "org-business", icon: BackpackIcon, permission: "生产办理、农服办理", tone: "cooperative" },
    { scenario: "org-viewer", icon: CubeIcon, permission: "冷链资源与记录只读", tone: "cold" },
  ];
  if (membershipStage === "active") spaces.push({ scenario: "org-invited", icon: GlobeIcon, permission: activatedCapabilities.join("、") || `${activatedRole}默认权限`, tone: "enterprise" });
  if (current === "gov-staff") spaces.push({ scenario: "gov-staff", icon: GlobeIcon, permission: "辖区概览、监管扫码、本人工单", tone: "government" });
  if (current === "bank-staff") spaces.push({ scenario: "bank-staff", icon: IdCardIcon, permission: "本行获授权意向、联系记录与状态", tone: "bank" });
  if (current === "ops-staff") spaces.push({ scenario: "ops-staff", icon: ReaderIcon, permission: "值守、形式审核摘要、数据质量", tone: "operations" });

  const isActive = (scenario: DemoScenario) => scenario === current || (scenario.startsWith("farmer-") && current.startsWith("farmer-"));

  return <main className="workspace-center-page">
    <SubHeader title="我的工作空间" onBack={onBack} />
    <div className="workspace-demo-note"><InfoCircledIcon /><span><strong>原型模拟数据</strong><small>点击空间只预览页面，不改变真实账号、主体或成员关系</small></span></div>

    <section className="unified-account-card">
      <span className="unified-account-icon"><IdCardIcon /></span>
      <span><small>数耒统一账号</small><strong>王建国</strong><em>138****2286 · 已实名</em></span>
      <button onClick={() => flash("进入统一账号安全与登录方式管理")}>账号安全<ChevronRightIcon /></button>
    </section>

    <section className="current-workspace-panel">
      <div className="workspace-panel-label"><span>当前工作空间</span><em>{currentMeta.status}</em></div>
      <h1>{currentMeta.fullName}</h1>
      <p>{currentMeta.type} · {currentMeta.role}</p>
      <div className="workspace-scope-grid"><span><small>数据范围</small><strong>{currentMeta.scope}</strong></span><span><small>成员有效期</small><strong>{currentMeta.validity}</strong></span></div>
      <button onClick={() => onSelect(current)}><DashboardIcon />进入当前工作台<ChevronRightIcon /></button>
    </section>

    <div className="workspace-section-title"><span><strong>我的空间</strong><small>一个账号可以加入多个组织</small></span><em>{spaces.length}个可进入</em></div>
    <section className="workspace-list">
      {spaces.map(({ scenario, icon: Icon, permission, tone }) => {
        const item = workspaceMeta[scenario];
        return <button className={isActive(scenario) ? "active" : ""} key={scenario} onClick={() => onSelect(scenario)}>
          <span className={`workspace-list-icon ${tone}`}><Icon /></span>
          <span><small>{item.type} · {item.status}</small><strong>{item.fullName}</strong><em>{item.role} · {permission}</em><i>{item.scope} · {item.validity}</i></span>
          {isActive(scenario) ? <b><CheckCircledIcon />当前</b> : <ChevronRightIcon />}
        </button>;
      })}
    </section>

    <div className="workspace-section-title"><span><strong>待处理关系</strong><small>{membershipStage === "active" ? "当前没有待处理的邀请或申请" : "未配置权限前不能进入组织"}</small></span><em>{membershipStage === "active" ? "0项" : "1项"}</em></div>
    {membershipStage === "invite" && <button className="pending-membership-card" onClick={onInvite}><ClockIcon /><span><small>组织邀请 · 3天后失效</small><strong>随州优鲜农产品有限公司</strong><em>拟邀请为业务人员，角色与数据范围待管理员配置</em></span><ChevronRightIcon /></button>}
    {membershipStage === "pending" && <button className="pending-membership-card accepted" onClick={onPending}><ClockIcon /><span><small>已接受 · 等待管理员配置</small><strong>随州优鲜农产品有限公司</strong><em>基础角色、能力权限包、数据范围与有效期尚未完成</em></span><ChevronRightIcon /></button>}
    {membershipStage === "active" && <div className="workspace-no-pending"><CheckCircledIcon /><span><strong>邀请已完成激活</strong><small>随州优鲜农产品已加入可进入空间</small></span></div>}

    <div className="workspace-section-title"><span><strong>新增工作空间</strong><small>按真实业务关系建立</small></span></div>
    <section className="workspace-create-grid">
      <button onClick={() => onSelect(farmerScenario)}><PersonIcon /><span><strong>本人农户</strong><small>已建立</small></span></button>
      <button onClick={onCreate}><PlusIcon /><span><strong>创建组织</strong><small>先查重再认证</small></span></button>
      <button onClick={onJoin}><IdCardIcon /><span><strong>加入组织</strong><small>可加入多家</small></span></button>
      <button onClick={onInstitution}><LockClosedIcon /><span><strong>机构开通</strong><small>政务/银行/运营</small></span></button>
    </section>

    <div className="workspace-section-title"><span><strong>关联产品</strong><small>同一账号登录，业务数据按授权互通</small></span><button onClick={onProduct}>查看授权<ChevronRightIcon /></button></div>
    <section className="related-products-card">
      <button onClick={onProduct}><span className="product-glyph shennong"><IdCardIcon /></span><span><strong>神农码</strong><small>账号已开通 · 当前产品</small></span><em className="ready">已登录</em></button>
      <button onClick={onProduct}><span className="product-glyph bobo"><BackpackIcon /></span><span><strong>播播农服</strong><small>统一账号可用 · 业务数据未授权</small></span><em>待授权</em></button>
      <button onClick={onProduct}><span className="product-glyph trade"><BarChartIcon /></span><span><strong>易票信</strong><small>产品访问与业务接口尚未接入</small></span><em>待接入</em></button>
      <button onClick={onProduct}><span className="product-glyph trace"><FileTextIcon /></span><span><strong>农源达</strong><small>保留历史用户与对象映射能力</small></span><em>待接入</em></button>
    </section>
    <button className="history-membership-entry" onClick={() => flash("查看已离职、停用和到期的历史成员关系")}><ClockIcon /><span><strong>历史组织关系</strong><small>离职或停用不影响个人账号和其他组织</small></span><ChevronRightIcon /></button>
  </main>;
}

function WorkspaceInviteSheet({ onClose, onAccept, flash }: { onClose: () => void; onAccept: () => void; flash: (message: string) => void }) {
  return <div className="workspace-sheet-body"><section className="invite-org-summary"><span><DashboardIcon /></span><div><small>邀请组织</small><strong>随州优鲜农产品有限公司</strong><em>农业企业 · 已认证</em></div></section><div className="workspace-sheet-fields"><div><span>邀请人</span><strong>刘经理 · 主体管理员</strong></div><div><span>拟分配角色</span><strong>业务人员</strong></div><div><span>数据范围</span><strong>待管理员配置</strong></div><div><span>成员有效期</span><strong>待管理员配置</strong></div></div><div className="boundary-note"><InfoCircledIcon /><p>接受后只生成待配置成员关系。角色、权限包、数据范围和有效期全部完成后，才会出现在可进入空间列表。</p></div><button className="primary-button" onClick={onAccept}>接受邀请</button><button className="secondary-button" onClick={() => { onClose(); flash("已保留邀请，可在有效期内再次处理"); }}>稍后处理</button></div>;
}

function ProductAccessSheet({ onClose, flash }: { onClose: () => void; flash: (message: string) => void }) {
  return <div className="workspace-sheet-body product-access-sheet"><div className="cross-product-boundary"><LockClosedIcon /><span><strong>账号互通不等于业务数据互通</strong><small>每个产品需要单独确认用途、对象、字段范围和期限。</small></span></div><section className="access-summary-list"><div><CheckCircledIcon /><span><strong>统一账号与实名状态</strong><small>神农码已使用；不共享身份证照片</small></span><em>已授权</em></div><div><ClockIcon /><span><strong>农户与组织主体关系</strong><small>其他产品首次使用时再次确认办理主体</small></span><em>待确认</em></div><div><LockClosedIcon /><span><strong>地块、产品、批次和农服记录</strong><small>当前没有跨产品业务数据授权</small></span><em>未授权</em></div></section><div className="product-access-rules"><strong>一期处理方式</strong><p>神农码保留统一账号、主体映射和授权接口；播播农服、易票信、农源达未接入时持续显示“待接入”，不模拟订单、交易或同步成功数据。</p></div><button className="primary-button" onClick={() => { onClose(); flash("授权设置已保存，本期未新增跨产品业务数据授权"); }}>知道了</button></div>;
}

function OrganizationAuthProgress({ stage, onBack, onSupplement, onRestricted, onApproved, onWorkbench, flash }: { stage: OrgAuthStage; onBack: () => void; onSupplement: () => void; onRestricted: () => void; onApproved: () => void; onWorkbench: () => void; flash: (message: string) => void }) {
  const isReview = stage === "review";
  const isApproved = stage === "approved";
  if (isApproved) return <main className="result-page org-auth-approved"><button className="result-back" aria-label="返回" onClick={onBack}><ArrowLeftIcon /></button><div className="result-ornament"><CheckCircledIcon /></div><small>组织认证审核已通过</small><h1>湖北随州丰禾农业有限公司</h1><p>标准主体 SN-SUB-421303-000168</p><section className="result-card"><div><span>认证状态</span><strong>已认证</strong></div><div><span>首位主体管理员</span><strong>王建国 · 已激活</strong></div><div><span>基础能力</span><strong>生产 · 已开通</strong></div><div><span>待补能力</span><strong>加工、品牌 · 待提交专项材料</strong></div><div><span>审核完成</span><strong>2026-08-17 09:18</strong></div></section><div className="boundary-note"><InfoCircledIcon /><p>主体认证只完成组织与代表关系核验；高风险业务能力仍需按模块单独审核，不能因为主体通过自动放开。</p></div><button className="primary-button" onClick={onWorkbench}>进入组织工作台<ChevronRightIcon /></button><button className="secondary-button" onClick={() => flash("PC 管理入口已发送至账号绑定手机号；手机号即统一账号")}>获取 PC 管理后台链接</button><button className="text-button" onClick={onRestricted}>返回空间总览</button></main>;
  return <main className="flow-page auth-progress-page"><SubHeader title="组织认证进度" onBack={onBack} /><section className={`auth-progress-hero ${isReview ? "review" : "supplement"}`}><span>{isReview ? <ReloadIcon /> : <InfoCircledIcon />}</span><div><small>{isReview ? "已补件 · 复核中" : "待补件 · 请于8月22日前提交"}</small><h1>{isReview ? "材料已进入人工复核" : "补充一项经营场所材料"}</h1><p>{isReview ? "最后更新：2026-08-15 11:26" : "初审未能确认实际经营地址，原申请信息无需重填。"}</p></div></section><section className="auth-progress-summary"><div><span>申请组织</span><strong>湖北随州丰禾农业有限公司</strong></div><div><span>申请单号</span><strong>SN-AUTH-20260815-0068</strong></div><div><span>当前责任方</span><strong>{isReview ? "随州市运营审核组" : "申请人"}</strong></div><div><span>预计更新</span><strong>{isReview ? "2个工作日内" : "提交补件后重新计时"}</strong></div></section><div className="workspace-section-title"><span><strong>认证时间线</strong><small>所有处理节点保留版本和责任人</small></span></div><section className="auth-timeline"><div className="done"><i><CheckCircledIcon /></i><span><strong>申请已提交</strong><small>2026-08-15 10:32 · 申请人王建国</small></span></div><div className="done"><i><CheckCircledIcon /></i><span><strong>登记信息初审</strong><small>2026-08-15 11:06 · 未发现重复标准主体</small></span></div><div className={isReview ? "done" : "current"}><i>{isReview ? <CheckCircledIcon /> : <InfoCircledIcon />}</i><span><strong>{isReview ? "经营场所材料已补充" : "需补充经营场所材料"}</strong><small>{isReview ? "2026-08-15 11:26 · 申请人提交" : "请于2026-08-22 18:00前完成"}</small></span></div><div className={isReview ? "current" : "waiting"}><i>{isReview ? <ReloadIcon /> : <ClockIcon />}</i><span><strong>主体与代表关系复核</strong><small>{isReview ? "权威接口未返回，已转人工复核" : "待补件后开始"}</small></span></div><div className="waiting"><i><LockClosedIcon /></i><span><strong>绑定标准主体</strong><small>通过后激活首位主体管理员</small></span></div></section>{!isReview ? <section className="supplement-task-card"><div><span><FileTextIcon /></span><strong>实际经营场所证明</strong><em>必填</em></div><p>上传租赁协议、权属证明或带地址的现场照片任一类；可遮挡与审核无关的敏感信息。</p><button onClick={onSupplement}>现在补充材料<ChevronRightIcon /></button></section> : <><div className="auth-review-note"><ReloadIcon /><span><strong>人工复核中</strong><small>权威登记接口未返回时，平台不伪造即时查询结果。</small></span></div><button className="admin-demo-entry auth-approved-demo" onClick={onApproved}><InfoCircledIcon /><span><strong>原型演示：查看审核通过状态</strong><small>生产环境只能由授权审核岗改变状态，申请人不能自行通过</small></span><ChevronRightIcon /></button></>}<div className="auth-progress-actions"><button className="primary-button" onClick={isReview ? () => flash("已刷新：当前仍为人工复核中") : onSupplement}>{isReview ? "刷新进度" : "补充材料"}</button><button className="secondary-button" onClick={onRestricted}>返回受限工作台</button><button className="text-button" onClick={() => flash("已记录联系客服请求，不重复催促审核")}>联系客服或申诉</button></div></main>;
}

function OrganizationAuthSupplement({ onBack, onSubmit, flash }: { onBack: () => void; onSubmit: () => void; flash: (message: string) => void }) {
  const [uploaded, setUploaded] = useState(false);
  return <main className="flow-page auth-supplement-page"><SubHeader title="认证补件" onBack={onBack} /><FlowIntro step="只补指定项" title="实际经营场所证明" desc="原申请信息已锁定，本次只补充审核人明确要求的材料。" icon={FileTextIcon} /><section className="supplement-requirements"><strong>可提交任一类材料</strong><div><CheckCircledIcon /><span><b>经营场所租赁协议</b><small>含地址、双方与有效期</small></span></div><div><CheckCircledIcon /><span><b>场所权属或使用证明</b><small>需能对应实际经营地址</small></span></div><div><CheckCircledIcon /><span><b>带定位与门牌的现场照片</b><small>至少两张，不作为单独认证结论</small></span></div></section><section className={`supplement-upload ${uploaded ? "uploaded" : ""}`}><button onClick={() => { setUploaded(true); flash("演示：已添加2张现场照片"); }}><CameraIcon /><span><strong>{uploaded ? "已添加2张现场照片" : "拍照或选择文件"}</strong><small>{uploaded ? "原图仅供受权审核人查看" : "支持照片、PDF；弱网先保存草稿"}</small></span><ChevronRightIcon /></button>{uploaded && <div><span>厉山镇示范园东门.jpg</span><em>已上传</em></div>}</section><section className="form-panel compact"><label className="form-field"><span>补充说明（可选）</span><KeyboardInput placeholder="例如：场所入口与营业执照地址一致" /></label><label className="check-line"><span className="checked-box"><CheckCircledIcon /></span><span>确认材料真实，仅用于本次主体认证复核</span></label></section><div className="boundary-note"><InfoCircledIcon /><p>系统会保留原申请和本次补件版本，不覆盖原审核记录。</p></div><div className="flow-foot"><button className="primary-button" disabled={!uploaded} onClick={onSubmit}>{uploaded ? "提交补件" : "请先添加材料"}<ChevronRightIcon /></button><button className="text-button" onClick={() => flash("补件草稿已保存，尚未提交")}>保存草稿</button></div></main>;
}

function MembershipPending({ onBack, onAdminDemo, flash }: { onBack: () => void; onAdminDemo: () => void; flash: (message: string) => void }) {
  return <main className="flow-page membership-pending-page"><SubHeader title="成员关系进度" onBack={onBack} /><section className="membership-pending-hero"><span><ClockIcon /></span><small>已接受邀请</small><h1>等待组织管理员配置</h1><p>当前还不能进入组织工作台</p></section><section className="pending-org-card"><span><GlobeIcon /></span><div><small>邀请组织 · 已认证</small><strong>随州优鲜农产品有限公司</strong><em>邀请人：刘经理 · 2026-08-15 11:38接受</em></div></section><section className="pending-config-list"><div className="done"><CheckCircledIcon /><span><strong>邀请已接受</strong><small>你已确认加入该组织</small></span><em>已完成</em></div><div><ClockIcon /><span><strong>基础角色</strong><small>主体管理员/业务人员/查看人员</small></span><em>待配置</em></div><div><ClockIcon /><span><strong>能力权限包</strong><small>按组织已开通能力选择查看或办理</small></span><em>待配置</em></div><div><ClockIcon /><span><strong>数据范围</strong><small>全组织、指定基地或本人任务</small></span><em>待配置</em></div><div><ClockIcon /><span><strong>生效与到期时间</strong><small>未设定前不激活任何权限</small></span><em>待配置</em></div></section><div className="boundary-note"><LockClosedIcon /><p>平台不会因为接受邀请就自动授予全组织权限；成员激活后仍会在打开页面和提交时重新校验。</p></div><div className="membership-contact-card"><PersonIcon /><span><strong>组织管理员：刘经理</strong><small>138****6092 · 工作日9:00—17:30</small></span><button onClick={() => flash("已向管理员发送一次限频催办")}>催办一次</button></div><button className="admin-demo-entry" onClick={onAdminDemo}><InfoCircledIcon /><span><strong>原型演示：查看管理员如何配置</strong><small>这是评审快捷入口，生产环境不允许普通成员切换成管理员</small></span><ChevronRightIcon /></button><div className="auth-progress-actions"><button className="secondary-button" onClick={() => flash("未激活关系取消后，邀请不再保留")}>取消未激活关系</button></div></main>;
}

function MemberPermissionSetup({ step, onBack, onNext, onActivate, flash }: { step: number; onBack: () => void; onNext: () => void; onActivate: (role: "业务人员" | "查看人员", capabilities: string[]) => void; flash: (message: string) => void }) {
  const [role, setRole] = useState<"业务人员" | "查看人员">("业务人员");
  const [capabilities, setCapabilities] = useState<string[]>(["生产办理", "农服办理"]);
  const toggleCapability = (value: string) => setCapabilities(items => items.includes(value) ? items.filter(item => item !== value) : [...items, value]);
  return <main className="flow-page member-setup-page"><SubHeader title="成员权限配置" onBack={onBack} /><div className="prototype-mode-banner member-admin-banner"><InfoCircledIcon /><span><strong>原型管理员视角</strong><small>仅演示权限闭环，不会提升当前真实用户权限</small></span></div><section className="member-subject-strip"><span className="member-avatar">王</span><div><small>待配置成员 · 由刘经理邀请</small><strong>王建国 · 138****2286</strong><em>随州优鲜农产品有限公司</em></div></section><div className="step-rail member-step-rail"><span className={step >= 1 ? "active" : ""}>1 角色</span><i /><span className={step >= 2 ? "active" : ""}>2 权限范围</span><i /><span className={step >= 3 ? "active" : ""}>3 有效期</span></div>{step === 1 && <><FlowIntro step="基础角色" title="他在组织中做什么？" desc="一期只保留三类基础角色；具体业务用能力权限包叠加。" icon={PersonIcon} /><section className="member-role-options"><button className={role === "业务人员" ? "selected" : ""} onClick={() => setRole("业务人员")}><ClipboardIcon /><span><strong>业务人员</strong><small>可按权限包办理生产、农服等具体工作</small></span>{role === "业务人员" && <CheckCircledIcon />}</button><button className={role === "查看人员" ? "selected" : ""} onClick={() => setRole("查看人员")}><LockClosedIcon /><span><strong>查看人员</strong><small>只读查看获授权范围，不出现办理按钮</small></span>{role === "查看人员" && <CheckCircledIcon />}</button></section><div className="boundary-note"><InfoCircledIcon /><p>主体管理员可管理成员和主体，不建议从普通邀请默认授予；需由已有管理员单独确认。</p></div></>}{step === 2 && <><FlowIntro step="能力与范围" title="允许办哪些事、看哪些数据？" desc="权限只能从组织已开通能力中选择，数据范围不会自动扩大。" icon={MixerHorizontalIcon} /><section className="member-permission-panel"><strong>能力权限包</strong><small>可多选，同一人可承担多项工作</small><div>{["生产办理", "农服办理", "品牌查看", "供需查看"].map(item => <button key={item} className={capabilities.includes(item) ? "selected" : ""} onClick={() => toggleCapability(item)}>{capabilities.includes(item) && <CheckCircledIcon />}{item}</button>)}</div></section><section className="member-scope-panel"><div className="card-title"><strong>数据范围</strong><small>必选</small></div><button className="selected"><SewingPinIcon /><span><small>指定基地</small><strong>厉山镇1号基地</strong></span><CheckCircledIcon /></button><button><PersonIcon /><span><small>更小范围</small><strong>仅本人任务</strong></span><ChevronRightIcon /></button></section><div className="risk-confirm"><InfoCircledIcon /><span><strong>本次不包含高风险权限</strong><small>报告签发、品牌授权、码停用等需另行复核</small></span></div></>}{step === 3 && <><FlowIntro step="有效期与确认" title="这段权限什么时候生效？" desc="有效期是成员激活的必填要素，到期后自动移入历史关系。" icon={CalendarIcon} /><section className="member-validity-panel"><SelectRow label="生效时间" value="2026-08-15 立即生效" /><SelectRow label="到期时间" value="2027-08-31 23:59" /><div className="permission-summary"><div><span>基础角色</span><strong>{role}</strong></div><div><span>能力权限包</span><strong>{capabilities.join("、") || "未选择"}</strong></div><div><span>数据范围</span><strong>厉山镇1号基地</strong></div><div><span>高风险权限</span><strong>无</strong></div></div><label className="check-line"><span className="checked-box"><CheckCircledIcon /></span><span>确认按最小必要权限配置，所有变更进入审计记录</span></label></section></>}<div className="flow-foot member-setup-foot"><button className="primary-button" onClick={() => step < 3 ? onNext() : onActivate(role, capabilities)}>{step < 3 ? "保存并继续" : "保存并激活成员"}<ChevronRightIcon /></button><button className="text-button" onClick={() => flash("权限草稿已保存，成员仍不可进入组织")}>仅保存草稿</button></div></main>;
}

function MemberActiveResult({ role, capabilities, onBack, onEnter, onSpaces }: { role: "业务人员" | "查看人员"; capabilities: string[]; onBack: () => void; onEnter: () => void; onSpaces: () => void }) {
  return <main className="result-page member-active-result"><button className="result-back" aria-label="返回" onClick={onBack}><ArrowLeftIcon /></button><div className="result-ornament"><CheckCircledIcon /></div><small>成员已激活</small><h1>王建国已可进入组织</h1><p>成员关系 SN-MEM-20260815-0186</p><section className="result-card"><div><span>组织</span><strong>随州优鲜农产品有限公司</strong></div><div><span>基础角色</span><strong>{role}</strong></div><div><span>能力权限包</span><strong>{capabilities.join("、") || "无"}</strong></div><div><span>数据范围</span><strong>厉山镇1号基地</strong></div><div><span>成员有效期</span><strong>2026-08-15—2027-08-31</strong></div><div><span>配置人</span><strong>刘经理 · 主体管理员</strong></div></section><div className="boundary-note"><InfoCircledIcon /><p>激活不会改变个人账号或其他组织关系。成员到期、停用或离职后数据仍归组织，历史操作人保留。</p></div><button className="primary-button" onClick={onEnter}>以该成员权限预览工作台<ChevronRightIcon /></button><button className="secondary-button" onClick={onSpaces}>返回我的工作空间</button></main>;
}

function OrganizationAuth({ step, onBack, onCancel, onNext }: { step: number; onBack: () => void; onCancel: () => void; onNext: () => void }) {
  if (step === 4) return <main className="result-page org-auth-result"><button className="result-back" aria-label="返回受限工作台" onClick={onCancel}><ArrowLeftIcon /></button><div className="result-ornament submitted"><ClockIcon /></div><small>组织认证申请已提交</small><h1>湖北随州丰禾农业有限公司</h1><p>申请单号 SN-AUTH-20260815-0068</p><section className="result-card"><div><span>当前状态</span><strong>运营初审中</strong></div><div><span>提交时间</span><strong>2026-08-15 10:32</strong></div><div><span>预计处理</span><strong>2个工作日内更新</strong></div><div><span>当前权限</span><strong>仅限空间设置与认证进度</strong></div></section><div className="boundary-note"><InfoCircledIcon /><p>提交申请不代表认证通过。平台将保留审核节点、处理人和补件版本；权威接口不可用时转人工复核。</p></div><button className="primary-button" onClick={onNext}>查看认证进度<ChevronRightIcon /></button><button className="secondary-button" onClick={onCancel}>返回受限工作台</button></main>;
  return <main className="flow-page org-auth-page"><SubHeader title="组织认证" onBack={onBack} /><div className="step-rail"><span className={step >= 1 ? "active" : ""}>登记核验</span><i /><span className={step >= 2 ? "active" : ""}>代表关系</span><i /><span className={step >= 3 ? "active" : ""}>能力确认</span></div>{step === 1 && <FlowIntro step="第1步" title="核验组织登记信息" desc="先用统一社会信用代码查重；接口不可用时转为材料上传和人工复核，不假装实时查询。" icon={IdCardIcon} />}{step === 2 && <FlowIntro step="第2步" title="确认你有权代表组织" desc="核验实际经营地址、联系人和法定代表人或受授权关系。" icon={PersonIcon} />}{step === 3 && <FlowIntro step="第3步" title="确认拟开通的业务能力" desc="组织类型决定认证材料，生产、加工、农服、品牌等能力可以叠加开通。" icon={DashboardIcon} />}<section className="form-panel compact">{step === 1 && <><label className="form-field"><span>统一社会信用代码</span><KeyboardInput defaultValue="9142**********281X" /></label><label className="form-field"><span>组织正式名称</span><KeyboardInput defaultValue="湖北随州丰禾农业有限公司" /></label><SelectRow label="登记类型" value="有限责任公司" /><div className="registry-match"><CheckCircledIcon /><span><strong>未发现重复主体</strong><small>演示结果 · 正式环境以权威接口/材料复核为准</small></span></div></>}{step === 2 && <><SelectRow label="实际经营地址" value="随州市曾都区厉山镇示范园" /><label className="form-field"><span>组织联系电话</span><KeyboardInput inputMode="tel" defaultValue="0722-****628" /></label><SelectRow label="我与组织的关系" value="法定代表人" /><button className="evidence-row"><FileTextIcon /><span><small>代表/授权材料</small><strong>营业执照与本人关系核验</strong></span><ChevronRightIcon /></button></>}{step === 3 && <><div className="field-choice capability-choice"><small>拟开通业务能力</small><div><button className="selected">生产</button><button className="selected">加工</button><button>收购</button><button>农服</button><button>冷链</button><button className="selected">品牌</button></div></div><div className="capability-status-list"><div><CheckCircledIcon /><span><strong>生产</strong><small>认证通过后可先开通基础能力</small></span></div><div><ClockIcon /><span><strong>加工、品牌</strong><small>需在能力页面补充对应材料</small></span></div></div><label className="check-line"><span className="checked-box"><CheckCircledIcon /></span><span>确认组织材料真实，并同意按能力分别核验</span></label></>}</section><div className="flow-foot"><button className="primary-button" onClick={onNext}>{step < 3 ? "下一步" : "提交组织认证"}<ChevronRightIcon /></button><button className="text-button" onClick={onCancel}>暂不认证，返回受限工作台</button></div></main>;
}

function BankWorkbench({ onBack, onDemo, onIntents, onPriority, flash }: { onBack: () => void; onDemo: () => void; onIntents: () => void; onPriority: () => void; flash: (message: string) => void }) {
  return <main className="workbench-page institution-workbench bank-workbench">
    <div className="prototype-mode-banner"><InfoCircledIcon /><span><strong>银行工作台演示</strong><small>真实银行机构、产品范围和人员必须先在 PC 端开通</small></span><button onClick={onDemo}>换场景</button></div>
    <section className="institution-workbench-head">
      <button aria-label="返回来源页" onClick={onBack}><ArrowLeftIcon /></button>
      <span><small>银行机构 · 机构已开通</small><h1>随州农商行 · 厉山支行</h1><p>银行业务人员 · 惠农产品/本人意向</p><em>成员有效期至 2027-06-30</em></span>
      <button className="pc-mini" onClick={() => flash("银行 PC 后台用于授权快照、分派、内部协同和审计；不在小程序完成授信审批")}><DesktopIcon />PC</button>
    </section>
    <section className="workbench-body institution-body">
      <div className="institution-boundary"><LockClosedIcon /><span><strong>银行只看本行被分派且仍在授权期内的服务意向</strong><small>无权浏览全市农户，不展示平台评分、授信额度或审批结论。</small></span></div>
      <div className="institution-section-title"><span><strong>我的服务意向</strong><small>数据截至 2026-08-15 11:20</small></span><button onClick={onIntents}>全部<ChevronRightIcon /></button></div>
      <section className="institution-metrics bank-metrics">
        <button onClick={onIntents}><small>待接收</small><strong>2</strong><em>本支行分派</em></button>
        <button onClick={onIntents}><small>待联系</small><strong>3</strong><em>其中今日2</em></button>
        <button onClick={onIntents}><small>授权将到期</small><strong>1</strong><em>3日内</em></button>
        <button onClick={onIntents}><small>状态待更新</small><strong>2</strong><em>用户可见</em></button>
      </section>
      <div className="institution-section-title"><span><strong>优先联系</strong><small>只显示完成本次授权的必要摘要</small></span><em>今日</em></div>
      <button className="institution-priority bank-priority" onClick={onPriority}><span><small>授权至 2026-09-15 · 今日15:00前</small><strong>王** · 香菇经营周转服务意向</strong><em>厉山镇 · 期望了解30万元以内产品 · 待联系</em></span><ChevronRightIcon /></button>
      <div className="institution-actions">
        <button onClick={onIntents}><ClipboardIcon /><span><strong>我的意向</strong><small>本行/本人范围</small></span></button>
        <button onClick={() => flash("查看本人已保存的联系记录")}><PersonIcon /><span><strong>联系记录</strong><small>内外记录分开</small></span></button>
        <button onClick={() => flash("查看需向用户同步的办理状态")}><PaperPlaneIcon /><span><strong>公开状态</strong><small>不含内部意见</small></span></button>
        <button onClick={() => flash("请转银行 PC 端按授权查看数据快照")}><DesktopIcon /><span><strong>授权快照</strong><small>转PC查看</small></span></button>
      </div>
      <section className="institution-list-card">
        <div className="card-title"><strong>最近动态</strong><small>用户授权和银行操作均可审计</small></div>
        <button onClick={onPriority}><ClockIcon /><span><strong>1项授权将在3日内到期</strong><small>到期后自动停止展示受限数据</small></span><em>待处理</em><ChevronRightIcon /></button>
        <button onClick={onIntents}><CheckCircledIcon /><span><strong>李**意向已转官方渠道</strong><small>银行流水号由银行系统管理</small></span><em>已同步</em><ChevronRightIcon /></button>
      </section>
      <div className="boundary-note"><InfoCircledIcon /><p>神农码一期只传递金融服务意向、授权摘要和公开进度。授信申请、征信、额度、合同、放款与还款全部在银行官方渠道完成。</p></div>
    </section>
  </main>;
}

function BankIntentList({ onBack, onDetail }: { onBack: () => void; onDetail: () => void }) {
  return <main className="core-list-page institution-secondary-page"><SubHeader title="我的服务意向" onBack={onBack} />
    <section className="secondary-scope-strip"><LockClosedIcon /><span><strong>当前范围：厉山支行 · 本人被分派意向</strong><small>退出组织或授权到期后立即停止访问</small></span></section>
    <section className="secondary-filter-row"><button className="active">待处理 5</button><button>跟进中 3</button><button>已结束 12</button></section>
    <section className="secondary-record-list">
      <button onClick={onDetail}><div><span className="status-pill warning">待联系</span><small>FIN-INT-20260815-026</small></div><strong>王** · 香菇经营周转服务意向</strong><p>厉山镇 · 期望了解30万元以内产品 · 授权至9月15日</p><footer><span>今日15:00前联系</span><em>查看必要摘要<ChevronRightIcon /></em></footer></button>
      <button onClick={onDetail}><div><span className="status-pill live">意向已提交</span><small>FIN-INT-20260815-031</small></div><strong>刘** · 农机购置金融服务</strong><p>曾都区 · 尚未分配联系人 · 授权字段6项</p><footer><span>今日17:00前接收</span><em>查看<ChevronRightIcon /></em></footer></button>
      <button onClick={onDetail}><div><span className="status-pill done">已转银行渠道</span><small>FIN-INT-20260812-018</small></div><strong>李** · 香稻收购周转服务</strong><p>随县 · 后续由银行官方渠道办理</p><footer><span>公开状态已同步</span><em>查看记录<ChevronRightIcon /></em></footer></button>
    </section>
    <div className="boundary-note"><InfoCircledIcon /><p>这里不是贷款申请清单。用户仅表达了解或对接银行服务的意向，银行仍需按官方制度另行受理。</p></div>
  </main>;
}

function BankIntentDetail({ state, onBack, onReceive, onContact, onPc }: { state: BankIntentState; onBack: () => void; onReceive: () => void; onContact: () => void; onPc: () => void }) {
  return <main className="core-detail-page institution-secondary-page"><SubHeader title="服务意向详情" onBack={onBack} />
    <section className="detail-hero-card bank-detail-hero"><div className="detail-kicker"><span className={`status-pill ${state === "已联系" || state === "已转银行渠道" ? "done" : "warning"}`}>{state}</span><em>FIN-INT-20260815-026</em></div><h1>王** · 香菇经营周转</h1><p>随州市曾都区厉山镇 · 数据截至 2026-08-15 10:42</p><div className="detail-status-row"><span><ClockIcon />今日15:00前联系</span><span><LockClosedIcon />授权至2026-09-15</span></div></section>
    <section className="detail-section-card"><div className="card-title"><strong>用户表达的服务需求</strong><small>用户自报</small></div><div className="detail-field-list"><div><span>希望了解</span><strong>香菇经营周转类银行产品</strong></div><div><span>资金用途</span><strong>菌棒采购与冷链周转</strong></div><div><span>意向金额</span><strong>30万元以内 · 非授信额度</strong></div><div><span>期望联系</span><strong>工作日 14:00—17:00</strong></div><div><span>联系方式</span><strong>138****2286 · 本意向已授权</strong></div></div></section>
    <section className="detail-section-card"><div className="card-title"><strong>本次数据授权</strong><small>逐项、限时</small></div><div className="detail-field-list"><div><span>授权用途</span><strong>本次金融服务对接</strong></div><div><span>可见字段</span><strong>主体状态、经营品类、追溯概况、农服履约摘要</strong></div><div><span>快照版本</span><strong>SN-FIN-SNAP-V1 · 生成后不回写源数据</strong></div><div><span>授权期限</span><strong>2026-08-15—2026-09-15</strong></div><div><span>最近查看</span><strong>尚未在 PC 打开完整快照</strong></div></div></section>
    <section className="evidence-disclaimer"><InfoCircledIcon /><span><strong>数据只能作为补充材料</strong><small>当前没有机构检测，也不能从溯源完整度推导信用分、收入、额度或审批结果。</small></span></section>
    <section className="detail-section-card"><div className="card-title"><strong>服务进度</strong><small>用户可见</small></div><div className="compact-timeline"><div className="done"><i><CheckCircledIcon /></i><span><strong>服务意向已提交</strong><small>8月15日 10:42 · 用户本人确认</small></span></div><div className={state === "意向已提交" ? "current" : "done"}><i><CheckCircledIcon /></i><span><strong>银行已接收</strong><small>{state === "意向已提交" ? "等待银行人员接收" : "厉山支行 · 分配给当前人员"}</small></span></div><div className={state === "已联系" || state === "已转银行渠道" ? "done" : "current"}><i><ClockIcon /></i><span><strong>联系与转官方渠道</strong><small>{state === "已联系" ? "已联系，等待用户确认下一步" : state === "已转银行渠道" ? "已转银行官方渠道" : "尚未联系"}</small></span></div></div></section>
    <div className="secondary-page-actions">{state === "意向已提交" && <button className="primary-button" onClick={onReceive}>接收并分配给我</button>}<button className="primary-button" onClick={onContact}>记录联系结果<ChevronRightIcon /></button><button className="secondary-button" onClick={onPc}><DesktopIcon />PC查看授权快照</button></div>
  </main>;
}

function BankContactPage({ onBack, onSubmit }: { onBack: () => void; onSubmit: () => void }) {
  return <main className="flow-page institution-secondary-page"><SubHeader title="记录联系结果" onBack={onBack} /><FlowIntro step="银行服务跟进" title="把对用户可见的进度说清楚" desc="公开进度与银行内部备注分开保存，避免把内部判断暴露给用户。" icon={PersonIcon} />
    <section className="form-panel compact"><SelectRow label="联系时间" value="2026-08-15 14:30" /><SelectRow label="联系方式" value="电话" /><SelectRow label="联系结果" value="已联系，用户希望了解材料清单" /><SelectRow label="下一步" value="发送银行官方渠道与材料清单" /><label className="form-field"><span>用户可见说明（必填）</span><KeyboardTextarea rows={3} defaultValue="银行工作人员已与您联系，后续请通过随州农商行官方渠道提交材料。" /></label><label className="form-field"><span>银行内部备注（用户不可见）</span><KeyboardTextarea rows={3} placeholder="仅填写必要的服务协同信息，不录入征信或审批意见" /></label></section>
    <div className="boundary-note"><LockClosedIcon /><p>不得把征信信息、内部风控判断、预计额度或审批承诺写入神农码。正式申请以银行系统流水号为准。</p></div>
    <div className="flow-foot"><button className="primary-button" onClick={onSubmit}>保存并同步公开状态<ChevronRightIcon /></button></div>
  </main>;
}

function GovernmentAreaOverview({ onBack, onOrders, flash }: { onBack: () => void; onOrders: () => void; flash: (message: string) => void }) {
  return <main className="core-list-page institution-secondary-page"><SubHeader title="辖区轻量概览" onBack={onBack} />
    <section className="secondary-scope-strip"><GlobeIcon /><span><strong>随州市 · 香菇/香稻监管专题</strong><small>截至2026-08-15 11:20 · 指标口径V1.3</small></span><button onClick={() => flash("口径：分子、分母、来源、截至时间均可查")}>口径</button></section>
    <section className="metric-definition-grid"><button onClick={() => flash("分子：近30日有追溯事件主体962；分母：授权范围有效主体1286")}><small>近30日活跃主体</small><strong>962 / 1,286</strong><em>74.8% · 主体库/事件库</em></button><button onClick={() => flash("分子：材料完整批次309；分母：活跃批次368")}><small>材料完整批次</small><strong>309 / 368</strong><em>84.0% · 追溯事件库</em></button><button onClick={onOrders}><small>待核实线索</small><strong>3件</strong><em>系统提示 · 非违法认定</em></button><button onClick={onOrders}><small>未办结工单</small><strong>7件</strong><em>其中逾期1件</em></button></section>
    <section className="region-drill-list"><div className="card-title"><strong>区县下钻</strong><small>数量优先，不强行算不可靠比例</small></div><button onClick={onOrders}><span><strong>曾都区</strong><small>有效主体486 · 活跃批次156 · 待核实2</small></span><em>2件工单<ChevronRightIcon /></em></button><button onClick={onOrders}><span><strong>随县</strong><small>有效主体538 · 活跃批次142 · 待核实1</small></span><em>4件工单<ChevronRightIcon /></em></button><button onClick={onOrders}><span><strong>广水市</strong><small>有效主体262 · 活跃批次70 · 暂无待核实</small></span><em>1件工单<ChevronRightIcon /></em></button></section>
    <div className="boundary-note"><InfoCircledIcon /><p>大屏、跨区域对比、报表导出与会议演示在 PC 端完成；移动端不提供会议或投屏功能。</p></div>
  </main>;
}

function GovernmentWorkOrders({ state, onBack, onDetail }: { state: GovernmentWorkOrderState; onBack: () => void; onDetail: () => void }) {
  return <main className="core-list-page institution-secondary-page"><SubHeader title="我的监管工单" onBack={onBack} />
    <section className="secondary-filter-row"><button className="active">待我处理 4</button><button>待复核 2</button><button>已办结 18</button></section>
    <section className="secondary-record-list"><button onClick={onDetail}><div><span className="status-pill warning">{state}</span><small>GOV-WO-20260815-031</small></div><strong>香菇追溯批次来源待现场核查</strong><p>曾都区 · 来源：系统线索转人工研判 · 风险等级P1</p><footer><span>今日16:00前</span><em>查看事实与证据<ChevronRightIcon /></em></footer></button><button onClick={onDetail}><div><span className="status-pill live">处理中</span><small>GOV-WO-20260814-026</small></div><strong>外部批次映射冲突待核实</strong><p>随县 · 影响2个批次 · 当前无监管定性</p><footer><span>明日12:00前</span><em>继续处理<ChevronRightIcon /></em></footer></button></section>
    <div className="boundary-note"><InfoCircledIcon /><p>系统风险等级用于排队，不等于违法、处罚或质量不合格结论；所有结论由有权限的政务人员按程序作出。</p></div>
  </main>;
}

function GovernmentWorkOrderDetail({ state, onBack, onAdvance, flash }: { state: GovernmentWorkOrderState; onBack: () => void; onAdvance: () => void; flash: (message: string) => void }) {
  return <main className="core-detail-page institution-secondary-page"><SubHeader title="监管工单详情" onBack={onBack} />
    <section className="detail-hero-card gov-detail-hero"><div className="detail-kicker"><span className={`status-pill ${state === "待复核" ? "done" : "warning"}`}>{state}</span><em>GOV-WO-20260815-031</em></div><h1>香菇追溯批次来源待现场核查</h1><p>曾都区 · 今日16:00前 · 当前承办人：王科员</p><div className="detail-status-row"><span><InfoCircledIcon />P1排队建议</span><span><LockClosedIcon />监管专题授权</span></div></section>
    <section className="evidence-disclaimer"><InfoCircledIcon /><span><strong>系统只提供待核实线索</strong><small>“批次来源字段不一致”不是违法认定，也不会自动停码或修改企业记录。</small></span></section>
    <section className="detail-section-card"><div className="card-title"><strong>问题事实与来源</strong><small>不可由政务端改写源记录</small></div><div className="detail-field-list"><div><span>线索来源</span><strong>外部接口映射校验 · 规则V1.8</strong></div><div><span>发现时间</span><strong>2026-08-15 09:18</strong></div><div><span>影响对象</span><strong>香菇批次2个 · 组织1家</strong></div><div><span>疑点事实</span><strong>收货批次引用来源与公开批次编号不一致</strong></div><div><span>已有证据</span><strong>接口响应摘要、批次版本V3、操作日志</strong></div></div></section>
    <section className="detail-section-card"><div className="card-title"><strong>处置要求</strong><small>当前工单</small></div><div className="detail-field-list"><div><span>核查方式</span><strong>联系主体并现场核对原始单据</strong></div><div><span>截止时间</span><strong>2026-08-15 16:00</strong></div><div><span>企业反馈</span><strong>{state === "待签收" ? "尚未发起整改通知" : "已提交来源单据2张，待核对"}</strong></div><div><span>处置记录</span><strong>{state === "待复核" ? "已提交事实说明与现场证据" : "尚未形成监管结论"}</strong></div></div></section>
    <section className="compact-timeline detail-section-card"><div className="done"><i><CheckCircledIcon /></i><span><strong>系统线索进入人工研判</strong><small>09:18 · 未触发自动处置</small></span></div><div className={state === "待签收" ? "current" : "done"}><i><PersonIcon /></i><span><strong>承办人签收</strong><small>{state === "待签收" ? "等待当前人员确认" : "王科员 · 11:26"}</small></span></div><div className={state === "待复核" ? "done" : "current"}><i><ClipboardIcon /></i><span><strong>现场核查与处置反馈</strong><small>{state === "待复核" ? "证据已提交，等待独立复核" : "处理后提交事实、证据和建议"}</small></span></div></section>
    <div className="secondary-page-actions">{state !== "待复核" && <button className="primary-button" onClick={onAdvance}>{state === "待签收" ? "签收工单" : "提交复核"}<ChevronRightIcon /></button>}<button className="secondary-button" onClick={() => flash("进入现场巡查：只记录事实、照片、时间和位置来源") }><CameraIcon />现场巡查</button><button className="text-button" onClick={() => flash("已提交转派申请，原承办关系在审批前仍有效")}>申请转派</button></div>
    {state === "待复核" && <div className="boundary-note"><LockClosedIcon /><p>当前承办人不能自行办结。复核人可在 PC 端查看整改前后版本、证据和影响链后决定办结、退回或升级。</p></div>}
  </main>;
}

function OperationsTaskList({ state, onBack, onDetail, onReview }: { state: OperationsTaskState; onBack: () => void; onDetail: () => void; onReview: () => void }) {
  return <main className="core-list-page institution-secondary-page"><SubHeader title="我的运营待办" onBack={onBack} />
    <section className="secondary-filter-row"><button className="active">待我处理 8</button><button>待验证 2</button><button>已完成 24</button></section>
    <section className="secondary-record-list"><button onClick={onDetail}><div><span className="status-pill warning">{state}</span><small>OPS-WO-20260815-019</small></div><strong>公众追溯页部分图片加载失败</strong><p>P2运行事件 · 影响3个公开批次 · 当前措施：回退缓存</p><footer><span>今日13:30前反馈</span><em>查看运行事实<ChevronRightIcon /></em></footer></button><button onClick={onReview}><div><span className="status-pill live">待签收</span><small>OPS-RV-20260815-008</small></div><strong>随州菇源农业组织认证形式审核</strong><p>仅核材料是否齐全、一致和可读，不作政府认证</p><footer><span>今日12:00前</span><em>查看缺项<ChevronRightIcon /></em></footer></button></section>
    <div className="boundary-note"><InfoCircledIcon /><p>主体事实错误退回主体更正；接口、程序和配置问题进入运营技术工单；质量与监管问题转政务研判。</p></div>
  </main>;
}

function OperationsTaskDetail({ state, onBack, onAdvance, flash }: { state: OperationsTaskState; onBack: () => void; onAdvance: () => void; flash: (message: string) => void }) {
  return <main className="core-detail-page institution-secondary-page"><SubHeader title="运营工单详情" onBack={onBack} />
    <section className="detail-hero-card ops-detail-hero"><div className="detail-kicker"><span className={`status-pill ${state === "待验证" ? "done" : "warning"}`}>{state}</span><em>OPS-WO-20260815-019</em></div><h1>公众追溯页部分图片加载失败</h1><p>P2运行事件 · 今日13:30前 · 当前处理人：陈运营</p></section>
    <section className="detail-section-card"><div className="card-title"><strong>运行事实</strong><small>脱敏摘要</small></div><div className="detail-field-list"><div><span>事件来源</span><strong>公众页可用性监测</strong></div><div><span>首次发现</span><strong>2026-08-15 10:58</strong></div><div><span>影响范围</span><strong>3个公开批次 · 图片资源请求失败</strong></div><div><span>当前措施</span><strong>回退至上一缓存版本</strong></div><div><span>敏感信息</span><strong>接口密钥与原始请求不在移动端展示</strong></div></div></section>
    <section className="evidence-disclaimer"><InfoCircledIcon /><span><strong>暂不判断业务数据错误</strong><small>当前证据指向展示资源异常；生产、质量和追溯事实未发生自动修改。</small></span></section>
    <section className="compact-timeline detail-section-card"><div className="done"><i><ReloadIcon /></i><span><strong>监测发现异常</strong><small>10:58 · 自动创建运营工单</small></span></div><div className={state === "待签收" ? "current" : "done"}><i><PersonIcon /></i><span><strong>运营人员签收</strong><small>{state === "待签收" ? "等待签收" : "陈运营 · 11:12"}</small></span></div><div className={state === "待验证" ? "done" : "current"}><i><CheckCircledIcon /></i><span><strong>恢复后独立验证</strong><small>{state === "待验证" ? "已标记恢复，等待监测复核" : "不得在手机批量重试或改配置"}</small></span></div></section>
    <div className="secondary-page-actions">{state !== "待验证" && <button className="primary-button" onClick={onAdvance}>{state === "待签收" ? "签收运营工单" : "标记恢复，等待验证"}<ChevronRightIcon /></button>}<button className="secondary-button" onClick={() => flash("已添加一条脱敏处理说明") }><ClipboardIcon />添加处理说明</button><button className="secondary-button" onClick={() => flash("请转PC查看调用链、执行单条重试或变更配置") }><DesktopIcon />转PC处理</button></div>
    <div className="boundary-note"><LockClosedIcon /><p>配置发布、批量重试、敏感原文和高风险事件最终关闭必须在 PC 端完成，并保留复核与审计。</p></div>
  </main>;
}

function OperationsFormalReview({ onBack, flash }: { onBack: () => void; flash: (message: string) => void }) {
  return <main className="core-detail-page institution-secondary-page"><SubHeader title="形式审核摘要" onBack={onBack} />
    <section className="detail-hero-card"><div className="detail-kicker"><span className="status-pill warning">待签收</span><em>OPS-RV-20260815-008</em></div><h1>随州菇源农业组织认证</h1><p>主体认证形式审核 · 今日12:00前</p></section>
    <section className="detail-section-card"><div className="card-title"><strong>材料检查</strong><small>只核形式，不作业务背书</small></div><div className="review-check-list"><div className="done"><CheckCircledIcon /><span><strong>登记信息</strong><small>统一社会信用代码、名称和登记区域格式完整</small></span></div><div className="warning"><InfoCircledIcon /><span><strong>实际经营场所证明</strong><small>门牌照片与申请地址缺少可读对应关系</small></span></div><div className="done"><CheckCircledIcon /><span><strong>代表关系材料</strong><small>授权材料已上传，待PC查看原件</small></span></div></div></section>
    <section className="detail-section-card"><div className="card-title"><strong>标准退回原因</strong><small>避免自由发挥业务结论</small></div><button className="selected-reason"><CheckCircledIcon /><span><strong>补充经营场所地址对应材料</strong><small>请上传带门牌的现场照片或含地址的有效证明</small></span></button></section>
    <div className="secondary-page-actions"><button className="primary-button" onClick={() => flash("已签收形式审核，未发布任何认证结论")}>签收审核</button><button className="secondary-button" onClick={() => flash("标准补件原因已保存为草稿，正式退回需在PC确认")}>保存退回原因草稿</button><button className="secondary-button" onClick={() => flash("请在PC查看原件、完整历史并提交正式审核动作") }><DesktopIcon />转PC正式处理</button></div>
    <div className="boundary-note"><InfoCircledIcon /><p>形式审核通过只表示材料齐全、一致和可读，不等于政府认证、能力开通、品牌授权或质量合格。</p></div>
  </main>;
}

function OperationsShiftHandover({ accepted, onBack, onAccept }: { accepted: boolean; onBack: () => void; onAccept: () => void }) {
  return <main className="core-detail-page institution-secondary-page"><SubHeader title="值班交接" onBack={onBack} />
    <section className="detail-hero-card shift-detail-hero"><div className="detail-kicker"><span className={`status-pill ${accepted ? "done" : "warning"}`}>{accepted ? "已接班" : "待确认"}</span><em>OPS-SHIFT-20260815-A</em></div><h1>今日早班 · 08:30—17:30</h1><p>交班人：李静 · 接班人：陈运营</p></section>
    <section className="handover-item-list"><div className={accepted ? "accepted" : ""}><span><small>P2运行事件 · 13:30前</small><strong>公众追溯页部分图片加载失败</strong><em>当前措施：回退缓存 · 下一步：验证3个公众页</em></span>{accepted ? <CheckCircledIcon /> : <ClockIcon />}</div><div className={accepted ? "accepted" : ""}><span><small>内容到期 · 8月20日前</small><strong>2条政府推荐服务将到期</strong><em>当前措施：已通知责任单位 · 下一步：等待续期或下线确认</em></span>{accepted ? <CheckCircledIcon /> : <ClockIcon />}</div></section>
    <section className="detail-section-card"><div className="card-title"><strong>交接字段</strong><small>逐项可追责</small></div><div className="detail-field-list"><div><span>风险与影响</span><strong>公众页图片展示、推荐内容有效期</strong></div><div><span>当前措施</span><strong>缓存回退、责任单位已通知</strong></div><div><span>下一动作</span><strong>独立验证、跟进续期/下线</strong></div><div><span>附件</span><strong>2份脱敏摘要 · 无密码/密钥</strong></div></div></section>
    <div className="secondary-page-actions"><button className="primary-button" disabled={accepted} onClick={onAccept}>{accepted ? "本班次已完成接收" : "逐项确认并接班"}<CheckCircledIcon /></button></div>
    <div className="boundary-note"><LockClosedIcon /><p>交接不传递账号密码、短信验证码、接口密钥或未脱敏敏感原文；权限仍按当前成员关系独立校验。</p></div>
  </main>;
}

function GovernmentWorkbench({ onBack, onDemo, onArea, onOrders, onPriority, flash }: { onBack: () => void; onDemo: () => void; onArea: () => void; onOrders: () => void; onPriority: () => void; flash: (message: string) => void }) {
  return <main className="workbench-page institution-workbench gov-workbench">
    <div className="prototype-mode-banner"><InfoCircledIcon /><span><strong>政务工作台演示</strong><small>真实机构和人员须先由 PC 端预置、邀请或机构 SSO 开通</small></span><button onClick={onDemo}>换场景</button></div>
    <section className="institution-workbench-head">
      <button aria-label="返回来源页" onClick={onBack}><ArrowLeftIcon /></button>
      <span><small>市级政务机构 · 机构已开通</small><h1>随州市农业农村局</h1><p>政务工作人员 · 随州市 · 风险与工单专题</p><em>成员有效期至 2027-06-30</em></span>
      <button className="pc-mini" onClick={() => flash("政务 PC 后台用于调度、报表和脱敏大屏；小程序不提供会议或投屏入口")}><DesktopIcon />PC</button>
    </section>
    <section className="workbench-body institution-body">
      <div className="institution-boundary"><LockClosedIcon /><span><strong>移动端没有政务身份认证入口</strong><small>无有效机构成员关系时，只提示联系本机构管理员，不允许个人上传材料自称政务人员。</small></span></div>
      <div className="institution-section-title"><span><strong>今日辖区摘要</strong><small>数据截至 2026-08-15 11:20 · 演示口径</small></span><button onClick={() => flash("查看指标来源、口径版本和数据质量说明")}>口径<InfoCircledIcon /></button></div>
      <section className="institution-metrics">
        <button onClick={onArea}><small>有效主体</small><strong>1,286</strong><em>辖区授权范围</em></button>
        <button onClick={onArea}><small>活跃批次</small><strong>368</strong><em>香稻/香菇</em></button>
        <button onClick={onOrders}><small>待核实风险</small><strong>3</strong><em>不是违法认定</em></button>
        <button onClick={onOrders}><small>未办工单</small><strong>7</strong><em>其中逾期1</em></button>
      </section>
      <div className="institution-section-title"><span><strong>我的工单</strong><small>仅显示本人和授权专题</small></span><button onClick={onOrders}>全部4项<ChevronRightIcon /></button></div>
      <button className="institution-priority" onClick={onPriority}><span><small>最高优先级 · 今日16:00前</small><strong>香菇追溯批次来源待现场核查</strong><em>曾都区 · 系统线索转人工研判 · 待签收</em></span><ChevronRightIcon /></button>
      <div className="institution-actions">
        <button onClick={() => flash("打开监管扫码，只展示对象公开与授权监管摘要")}><CameraIcon /><span><strong>监管扫码</strong><small>核对象与来源</small></span></button>
        <button onClick={() => flash("新建现场巡查记录")}><ClipboardIcon /><span><strong>现场巡查</strong><small>记录事实证据</small></span></button>
        <button onClick={onArea}><GlobeIcon /><span><strong>查看辖区</strong><small>按授权专题</small></span></button>
        <button onClick={onOrders}><PaperPlaneIcon /><span><strong>工单反馈</strong><small>提交处置事实</small></span></button>
      </div>
      <section className="institution-list-card">
        <div className="card-title"><strong>风险提醒</strong><small>系统提示必须人工研判</small></div>
        <button onClick={() => flash("查看风险影响摘要和来源")}><InfoCircledIcon /><span><strong>外部批次映射冲突</strong><small>随县 · 2个对象 · 11:08发现</small></span><em>待核实</em><ChevronRightIcon /></button>
        <button onClick={() => flash("查看承诺达标合格证适用规则")}><CheckCircledIcon /><span><strong>香菇合格证规则更新</strong><small>规则来源：平台主管确认版本</small></span><em>关注</em><ChevronRightIcon /></button>
      </section>
      <div className="boundary-note"><InfoCircledIcon /><p>小程序只做轻量查看、监管扫码、现场巡查和本人工单；跨区域调度、复杂分析、报表和脱敏16:9演示全部转 PC，小程序没有会议或投屏按钮。</p></div>
    </section>
  </main>;
}

function OperationsWorkbench({ onBack, onDemo, onTasks, onPriority, onReview, onShift, flash }: { onBack: () => void; onDemo: () => void; onTasks: () => void; onPriority: () => void; onReview: () => void; onShift: () => void; flash: (message: string) => void }) {
  return <main className="workbench-page institution-workbench ops-workbench">
    <div className="prototype-mode-banner"><InfoCircledIcon /><span><strong>运营工作台演示</strong><small>真实运营机构、委托范围和首位管理员必须先在 PC 端建立</small></span><button onClick={onDemo}>换场景</button></div>
    <section className="institution-workbench-head">
      <button aria-label="返回来源页" onClick={onBack}><ArrowLeftIcon /></button>
      <span><small>随州租户 · 运营授权有效</small><h1>神农码运营中心</h1><p>运营人员 · 形式审核/数据质量 · 随州市</p><em>委托有效期至 2027-03-31</em></span>
      <button className="pc-mini" onClick={() => flash("运营 PC 后台用于内容、配置、批量审核、接口运行、审计与交接管理")}><DesktopIcon />PC</button>
    </section>
    <section className="workbench-body institution-body">
      <div className="institution-boundary"><LockClosedIcon /><span><strong>移动端不能申请成为运营人员</strong><small>必须先存在有效运营委托、机构授权和成员关系；运营人员不能给自己扩权或续期。</small></span></div>
      <section className="shift-card"><span><ClockIcon /></span><div><small>今日值班 · 08:30—17:30</small><strong>当前班次已接班</strong><em>交班人：李静 · 未交接事项2项</em></div><button onClick={onShift}>查看交接</button></section>
      <div className="institution-section-title"><span><strong>我的待办</strong><small>只显示本人被分配事项</small></span><button onClick={onTasks}>全部8项<ChevronRightIcon /></button></div>
      <section className="ops-task-grid">
        <button onClick={onReview}><BadgeIcon /><span><strong>形式审核</strong><small>待签收 3</small></span><em>最早12:00</em></button>
        <button onClick={onTasks}><MixerHorizontalIcon /><span><strong>数据质量</strong><small>处理中 2</small></span><em>冲突/缺失</em></button>
        <button onClick={onTasks}><PersonIcon /><span><strong>客服工单</strong><small>待回复 2</small></span><em>均已脱敏</em></button>
        <button onClick={onPriority}><ReloadIcon /><span><strong>接口异常</strong><small>待确认 1</small></span><em>结果未知</em></button>
      </section>
      <div className="institution-section-title"><span><strong>运行摘要</strong><small>数据截至 2026-08-15 11:20</small></span><button onClick={() => flash("完整运行和重试操作请前往 PC")}>PC处理<DesktopIcon /></button></div>
      <section className="institution-list-card ops-list-card">
        <button onClick={() => flash("查看码解析失败摘要，不在手机批量重试")}><ReloadIcon /><span><strong>码解析失败</strong><small>3次 · 影响对象待确认</small></span><em>待处理</em><ChevronRightIcon /></button>
        <button onClick={() => flash("查看外部系统待对接登记")}><GlobeIcon /><span><strong>播播农服数据接口</strong><small>尚未建立真实接口与字段授权</small></span><em>待对接</em><ChevronRightIcon /></button>
        <button onClick={() => flash("查看即将到期内容清单")}><ClockIcon /><span><strong>政府推荐内容</strong><small>2条将在7日内到期，待责任方确认</small></span><em>待确认</em><ChevronRightIcon /></button>
      </section>
      <button className="institution-priority ops-priority" onClick={onPriority}><span><small>P2运行事件 · 13:30前反馈</small><strong>公众追溯页部分图片加载失败</strong><em>影响范围：3个公开批次 · 当前措施：回退缓存</em></span><ChevronRightIcon /></button>
      <div className="boundary-note"><InfoCircledIcon /><p>运营移动端只做值守、本人待办、形式审核摘要和交接。内容编辑、配置发布、批量审核、敏感数据、接口密钥、正式审计和运营交接必须转 PC；运营不能替政府、银行、企业或品牌方作业务决定。</p></div>
    </section>
  </main>;
}

function OrganizationWorkbench({ scenario, memberCapabilities, onBack, onRoles, onScan, onTrace, onFarm, onBrand, onTrade, onDemo, flash }: { scenario: DemoScenario; memberCapabilities: string[]; onBack: () => void; onRoles: () => void; onScan: () => void; onTrace: () => void; onFarm: () => void; onBrand: () => void; onTrade: () => void; onDemo: () => void; flash: (message: string) => void }) {
  const workspace = workspaceMeta[scenario];
  const role = workspace.role;
  const readOnly = scenario === "org-viewer";
  const invitedMember = scenario === "org-invited";
  const can = (prefix: string) => !invitedMember || memberCapabilities.some(item => item.startsWith(prefix));
  return <main className="workbench-page org-workbench"><div className="prototype-mode-banner"><InfoCircledIcon /><span><strong>原型演示模式</strong><small>仅用于评审，不是真实主体或角色切换</small></span><button onClick={onDemo}>换场景</button></div><section className="org-workbench-head"><button onClick={onBack}><ArrowLeftIcon /></button><span><small>{workspace.type} · {workspace.status}</small><h1>{workspace.shortName}</h1><p>{role} · {workspace.scope} · {workspace.validity}</p></span><button className="pc-mini" onClick={() => flash("打开企业 PC 管理后台链接说明")}><DesktopIcon />PC</button></section><section className="workbench-body org-body"><button className="org-priority-task" onClick={onTrace}><span><small>最高优先级</small><strong>{readOnly ? "查看本周授权数据摘要" : "3条移动采集记录待PC完善"}</strong><em>{readOnly ? `范围：${workspace.scope}` : "来源：现场业务人员 · 截至11:10"}</em></span><ChevronRightIcon /></button><div className="org-quick-actions"><button disabled={readOnly} onClick={onScan}><CameraIcon /><span><strong>扫码接收</strong><small>{readOnly ? "无办理权限" : "现场单条"}</small></span></button><button disabled={readOnly} onClick={onTrace}><ClipboardIcon /><span><strong>现场记录</strong><small>{readOnly ? "无办理权限" : "语音/拍照"}</small></span></button><button disabled={readOnly} onClick={onTrace}><TargetIcon /><span><strong>任务执行</strong><small>{readOnly ? "无办理权限" : "本人范围"}</small></span></button><button onClick={onRoles}><PersonIcon /><span><strong>成员角色</strong><small>{role}</small></span></button></div><div className="section-heading"><div><span>已开通能力</span><small>按权限展示</small></div></div><div className="org-capability-cards">{can("生产") && <button onClick={onTrace}><span><FileTextIcon /></span><div><strong>生产与溯源</strong><small>在产批次 6 · 待完善 3</small></div><em>{readOnly ? "查看" : "办理"}</em></button>}{can("农服") && <button onClick={onFarm}><span><BackpackIcon /></span><div><strong>农服需求</strong><small>公开需求 2 · 待确认 1</small></div><em>{readOnly ? "查看" : "办理"}</em></button>}{invitedMember && can("品牌") ? <button onClick={onBrand}><span><BadgeIcon /></span><div><strong>品牌能力</strong><small>授权品牌档案 2 个</small></div><em>查看</em></button> : !invitedMember && <button onClick={onBrand}><span><BadgeIcon /></span><div><strong>品牌能力</strong><small>材料准备中 · 尚未开通</small></div><em>受限</em></button>}{invitedMember && can("供需") && <button onClick={onTrade}><span><BarChartIcon /></span><div><strong>供需信息</strong><small>组织公开供需信息</small></div><em>查看</em></button>}</div>{scenario === "org-admin" && <button className="role-admin-entry" onClick={onRoles}><PersonIcon /><span><strong>配置成员与权限</strong><small>三类基础角色＋能力权限包＋数据范围＋有效期</small></span><ChevronRightIcon /></button>}<div className="boundary-note"><InfoCircledIcon /><p>移动端只处理现场采集、本人待办和轻量确认；批量维护、成员配置、统计与审核进入 PC。</p></div></section></main>;
}

function RoleManagement({ scenario, onBack, flash }: { scenario: DemoScenario; onBack: () => void; flash: (message: string) => void }) {
  const admin = scenario === "org-admin";
  return <main className="flow-page role-management-page"><SubHeader title="成员与角色" onBack={onBack} /><div className="prototype-inline-note"><InfoCircledIcon />演示页面：展示角色与权限关系，不会修改真实成员。</div><FlowIntro step="轻量角色模型" title="三个基础角色，能力按需组合" desc="小企业可以由一个人办理多项工作，无需为每个环节虚构员工岗位。" icon={PersonIcon} /><section className="base-role-cards"><div className="selected"><span><DashboardIcon /></span><strong>主体管理员</strong><p>主体、能力、成员和全局异常管理；高风险授权需单独确认。</p></div><div><span><ClipboardIcon /></span><strong>业务人员</strong><p>按权限包办理生产、收购、仓储、加工、农服、品牌等业务。</p></div><div><span><LockClosedIcon /></span><strong>查看人员</strong><p>只读查看获授权的数据范围，不出现提交和变更按钮。</p></div></section><section className="member-list"><div className="card-title"><strong>组织成员</strong><button disabled={!admin} onClick={() => flash("进入邀请成员") }><PlusIcon />邀请</button></div><div className="member-row"><span className="member-avatar">王</span><span><strong>王建国</strong><small>主体管理员 · 全部已开通能力 · 曾都区基地</small><em>长期有效</em></span><button disabled={!admin}>配置</button></div><div className="member-row"><span className="member-avatar">李</span><span><strong>李春梅</strong><small>业务人员 · 生产办理/品牌查看 · 1号基地</small><em>至2027-02-28</em></span><button disabled={!admin}>配置</button></div><div className="member-row"><span className="member-avatar">周</span><span><strong>周师傅</strong><small>业务人员 · 农服办理 · 本人任务</small><em>至2026-12-31</em></span><button disabled={!admin}>配置</button></div></section><div className="permission-packs"><strong>权限配置示例</strong><div><span>基础角色：业务人员</span><span>能力包：生产办理、农服办理</span><span>数据范围：曾都区1号基地</span><span>有效期：2026-08-14—2027-02-28</span></div><p>同一个人可以在多家组织拥有不同角色；成员失效后数据仍归组织，历史操作人保留。</p></div></main>;
}

function BottomNav({ active, onNavigate }: { active: MainTab; onNavigate: (view: MainTab) => void }) {
  return (
    <nav className="bottom-nav" aria-label="主导航">
      <button className={active === "home" ? "active" : ""} onClick={() => onNavigate("home")}><HomeIcon /><span>首页</span></button>
      <button className={`center-code ${active === "code" ? "active" : ""}`} onClick={() => onNavigate("code")}><span className="code-orb"><img src="/assets/shennong/mascot.png" alt="" aria-hidden="true" draggable={false} /><IdCardIcon /></span><b>神农码</b></button>
      <button className={active === "mine" ? "active" : ""} onClick={() => onNavigate("mine")}><PersonIcon /><span>我的</span></button>
    </nav>
  );
}

function SubHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return <header className="sub-header"><button aria-label="返回" onClick={onBack}><ArrowLeftIcon /></button><strong>{title}</strong><span /></header>;
}

function FlowIntro({ step, title, desc, icon: Icon }: { step: string; title: string; desc: string; icon: IconType }) {
  return <section className="flow-intro"><span className="flow-icon"><Icon /></span><div><small>{step}</small><h1>{title}</h1><p>{desc}</p></div></section>;
}

function ActorOption({ icon: Icon, title, desc, onClick, emphasized = false }: { icon: IconType; title: string; desc: string; onClick: () => void; emphasized?: boolean }) {
  return <button className={emphasized ? "emphasized" : ""} onClick={onClick}><span><Icon /></span><div><strong>{title}</strong><small>{desc}</small></div><ChevronRightIcon /></button>;
}

function SelectRow({ label, value }: { label: string; value: string }) {
  return <button className="select-row"><span><small>{label}</small><strong>{value}</strong></span><ChevronRightIcon /></button>;
}

function MenuRow({ icon: Icon, title, sub, onClick }: { icon: IconType; title: string; sub?: string; onClick: () => void }) {
  return <button className="menu-row" onClick={onClick}><span className="menu-icon"><Icon /></span><span><strong>{title}</strong>{sub && <small>{sub}</small>}</span><ChevronRightIcon /></button>;
}

function realNameLabel(hasFarmer: boolean) {
  return hasFarmer ? "已实名 · 已建立农户档案" : "已实名 · 尚无业务主体";
}
