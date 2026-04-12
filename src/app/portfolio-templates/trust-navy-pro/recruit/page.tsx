"use client";

import { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft, Upload, Check, X, MapPin, Clock, Briefcase,
  GraduationCap, DollarSign, Calendar, Users, Building2,
  Shield, ChevronDown, FileText, Phone, Mail,
} from "lucide-react";
import Link from "next/link";

/* ═══════════════════════════════════════
   採用情報 — 建設会社プレミアム限定
   詳細要項 + 履歴書・職務経歴書アップロード付き応募フォーム
   ═══════════════════════════════════════ */

const COMPANY = {
  name: "鈴木建設株式会社",
  nameEn: "SUZUKI CONSTRUCTION",
  phone: "03-0000-0000",
  email: "recruit@suzuki-kensetsu.co.jp",
};

const BENEFITS = [
  "完全週休2日制（土日祝）",
  "年間休日125日",
  "有給休暇（初年度10日）",
  "社会保険完備",
  "退職金制度",
  "資格取得支援制度（費用全額会社負担）",
  "住宅手当（月3万円まで）",
  "家族手当",
  "通勤手当（月5万円まで）",
  "健康診断（年1回）",
  "社員旅行（年1回）",
  "育児・介護休業制度",
];

const JOBS = [
  {
    id: "sekou-kenchiku",
    title: "施工管理（建築）",
    type: "正社員",
    location: "東京都千代田区（現場は首都圏全域）",
    salary: "年収450万円〜700万円（経験・資格に応じて）",
    experience: "建築施工管理の実務経験3年以上",
    licenses: ["1級建築施工管理技士（歓迎）", "2級建築施工管理技士（歓迎）", "1級建築士（歓迎）"],
    description: "RC造・S造の建築工事における施工管理業務全般をお任せします。品質管理、工程管理、安全管理、原価管理を中心に、発注者・設計者・協力業者との折衝まで幅広くご担当いただきます。",
    duties: [
      "施工計画の立案・管理",
      "品質管理・工程管理・安全管理・原価管理",
      "協力業者との打ち合わせ・調整",
      "発注者・設計事務所との折衝",
      "施工図の確認・作成指示",
      "検査対応（中間検査・完了検査）",
    ],
    requirements: [
      "建築施工管理の実務経験3年以上",
      "RC造またはS造の施工管理経験",
      "普通自動車運転免許",
    ],
    preferred: [
      "1級建築施工管理技士",
      "公共工事の施工管理経験",
      "BIM/CIMの知識・経験",
    ],
  },
  {
    id: "sekou-doboku",
    title: "施工管理（土木）",
    type: "正社員",
    location: "東京都千代田区（現場は首都圏全域）",
    salary: "年収400万円〜650万円（経験・資格に応じて）",
    experience: "土木施工管理の実務経験3年以上",
    licenses: ["1級土木施工管理技士（歓迎）", "2級土木施工管理技士（歓迎）"],
    description: "道路・橋梁・上下水道などの土木工事における施工管理業務をお任せします。地域のインフラを支えるやりがいのある仕事です。",
    duties: [
      "土木工事の施工計画・管理",
      "品質管理・工程管理・安全管理",
      "協力業者の管理・調整",
      "官公庁との折衝・書類作成",
      "測量・出来形管理",
    ],
    requirements: [
      "土木施工管理の実務経験3年以上",
      "普通自動車運転免許",
    ],
    preferred: [
      "1級土木施工管理技士",
      "公共工事の経験",
      "ICT施工の知識",
    ],
  },
  {
    id: "sekkei",
    title: "設計（意匠）",
    type: "正社員",
    location: "東京都千代田区",
    salary: "年収400万円〜600万円（経験・資格に応じて）",
    experience: "意匠設計の実務経験2年以上",
    licenses: ["1級建築士（歓迎）", "2級建築士"],
    description: "商業施設・集合住宅を中心とした意匠設計をお任せします。基本設計から実施設計、現場監理まで一貫して携わることができます。",
    duties: [
      "基本設計・実施設計",
      "施主との打ち合わせ・プレゼンテーション",
      "確認申請図書の作成",
      "工事監理",
      "設計図書の品質管理",
    ],
    requirements: [
      "意匠設計の実務経験2年以上",
      "2級建築士以上",
      "AutoCAD または BIMソフトの操作",
    ],
    preferred: [
      "1級建築士",
      "BIM（Revit等）の実務経験",
      "商業施設の設計経験",
    ],
  },
];

/* ═══════ Header ═══════ */
function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-[1200px] mx-auto px-5 h-14 flex items-center justify-between">
        <Link href="/portfolio-templates/trust-navy-pro" className="flex items-center gap-2 text-gray-500 text-sm hover:text-[#1B3A5C] transition-colors">
          <ArrowLeft className="w-4 h-4" /> サイトに戻る
        </Link>
        <div className="text-right">
          <p className="text-[#1B3A5C] font-bold text-sm">{COMPANY.name}</p>
          <p className="text-gray-400 text-[9px] tracking-wider">採用情報</p>
        </div>
      </div>
    </header>
  );
}

/* ═══════ Job Detail ═══════ */
function JobDetail({ job, onApply }: { job: typeof JOBS[0]; onApply: () => void }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <motion.div
      className="bg-white border border-gray-200 overflow-hidden"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-[#F0F4F8]">
        <div className="flex items-center gap-2 mb-2">
          <span className="px-2.5 py-0.5 bg-[#1B3A5C] text-white text-[10px] font-medium">{job.type}</span>
          <span className="text-gray-400 text-xs">{job.location}</span>
        </div>
        <h2 className="text-[#1B3A5C] font-bold text-xl mb-2">{job.title}</h2>
        <p className="text-gray-600 text-sm leading-relaxed">{job.description}</p>
      </div>

      {/* Details table */}
      <div className="divide-y divide-gray-200">
        {[
          { icon: DollarSign, label: "給与", value: job.salary },
          { icon: MapPin, label: "勤務地", value: job.location },
          { icon: Clock, label: "勤務時間", value: "8:30〜17:30（実働8時間・休憩60分）" },
          { icon: Calendar, label: "休日", value: "完全週休2日制（土日祝）、年間休日125日" },
          { icon: GraduationCap, label: "必要な経験", value: job.experience },
        ].map((row) => {
          const Icon = row.icon;
          return (
            <div key={row.label} className="flex flex-col sm:flex-row">
              <div className="sm:w-44 px-6 py-3.5 bg-gray-50 text-gray-500 text-sm font-medium flex items-center gap-2">
                <Icon className="w-4 h-4 text-[#C8A96E]" strokeWidth={1.5} />
                {row.label}
              </div>
              <div className="flex-1 px-6 py-3.5 text-gray-700 text-sm">{row.value}</div>
            </div>
          );
        })}

        {/* 業務内容 */}
        <div className="flex flex-col sm:flex-row">
          <div className="sm:w-44 px-6 py-3.5 bg-gray-50 text-gray-500 text-sm font-medium">業務内容</div>
          <div className="flex-1 px-6 py-3.5">
            <ul className="space-y-1.5">
              {job.duties.map((d) => (
                <li key={d} className="flex items-start gap-2 text-gray-700 text-sm">
                  <span className="text-[#C8A96E] mt-1">•</span> {d}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 必須要件 */}
        <div className="flex flex-col sm:flex-row">
          <div className="sm:w-44 px-6 py-3.5 bg-gray-50 text-gray-500 text-sm font-medium">必須要件</div>
          <div className="flex-1 px-6 py-3.5">
            <ul className="space-y-1.5">
              {job.requirements.map((r) => (
                <li key={r} className="flex items-start gap-2 text-gray-700 text-sm">
                  <Check className="w-4 h-4 text-[#1B3A5C] mt-0.5 flex-shrink-0" strokeWidth={2} /> {r}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 歓迎要件 */}
        <div className="flex flex-col sm:flex-row">
          <div className="sm:w-44 px-6 py-3.5 bg-gray-50 text-gray-500 text-sm font-medium">歓迎要件</div>
          <div className="flex-1 px-6 py-3.5">
            <ul className="space-y-1.5">
              {job.preferred.map((p) => (
                <li key={p} className="flex items-start gap-2 text-gray-600 text-sm">
                  <span className="text-[#C8A96E] mt-1">★</span> {p}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 資格 */}
        <div className="flex flex-col sm:flex-row">
          <div className="sm:w-44 px-6 py-3.5 bg-gray-50 text-gray-500 text-sm font-medium">歓迎資格</div>
          <div className="flex-1 px-6 py-3.5">
            <div className="flex flex-wrap gap-2">
              {job.licenses.map((l) => (
                <span key={l} className="px-3 py-1 border border-gray-200 text-gray-600 text-xs">{l}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Apply CTA */}
      <div className="p-6 bg-[#F0F4F8] border-t border-gray-200">
        <button
          onClick={onApply}
          className="w-full py-4 bg-[#1B3A5C] text-white font-bold text-sm tracking-wider hover:bg-[#2A5080] transition-colors flex items-center justify-center gap-2"
        >
          <Briefcase className="w-4 h-4" /> この職種に応募する
        </button>
      </div>
    </motion.div>
  );
}

/* ═══════ Application Form ═══════ */
function ApplicationForm({ job, onClose }: { job: typeof JOBS[0]; onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [resumeFile, setResumeFile] = useState<string | null>(null);
  const [cvFile, setCvFile] = useState<string | null>(null);
  const resumeRef = useRef<HTMLInputElement>(null);
  const cvRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (s: string | null) => void) => {
    const file = e.target.files?.[0];
    if (file) setter(file.name);
  };

  if (submitted) {
    return (
      <motion.div className="bg-white border border-gray-200 p-10 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="w-16 h-16 bg-[#1B3A5C]/10 flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-[#1B3A5C]" />
        </div>
        <h3 className="text-[#1B3A5C] text-xl font-bold mb-2">ご応募ありがとうございます</h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-2">
          応募内容を確認のうえ、5営業日以内にご連絡いたします。
        </p>
        <p className="text-gray-400 text-xs mb-6">
          応募ポジション：{job.title}
        </p>
        <button onClick={onClose} className="px-8 py-2.5 border border-gray-200 text-gray-600 text-sm hover:bg-gray-50 transition-colors">
          募集一覧に戻る
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div className="bg-white border border-gray-200 overflow-hidden" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
      <div className="px-6 py-4 bg-[#1B3A5C] text-white flex items-center justify-between">
        <div>
          <p className="font-bold text-sm">応募フォーム</p>
          <p className="text-white/60 text-xs">{job.title}</p>
        </div>
        <button onClick={onClose} className="w-7 h-7 bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="p-6 sm:p-8 space-y-5">
        {/* Basic info */}
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 font-medium">お名前 <span className="text-red-400">*</span></label>
            <input type="text" required className="w-full px-4 py-3 border border-gray-200 text-sm focus:outline-none focus:border-[#1B3A5C]" placeholder="鈴木 太郎" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 font-medium">ふりがな <span className="text-red-400">*</span></label>
            <input type="text" required className="w-full px-4 py-3 border border-gray-200 text-sm focus:outline-none focus:border-[#1B3A5C]" placeholder="すずき たろう" />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 font-medium">メールアドレス <span className="text-red-400">*</span></label>
            <input type="email" required className="w-full px-4 py-3 border border-gray-200 text-sm focus:outline-none focus:border-[#1B3A5C]" placeholder="taro@example.com" />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 font-medium">電話番号 <span className="text-red-400">*</span></label>
            <input type="tel" required className="w-full px-4 py-3 border border-gray-200 text-sm focus:outline-none focus:border-[#1B3A5C]" placeholder="090-1234-5678" />
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1.5 font-medium">年齢</label>
          <input type="number" className="w-32 px-4 py-3 border border-gray-200 text-sm focus:outline-none focus:border-[#1B3A5C]" placeholder="35" />
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1.5 font-medium">保有資格</label>
          <input type="text" className="w-full px-4 py-3 border border-gray-200 text-sm focus:outline-none focus:border-[#1B3A5C]" placeholder="例：1級建築施工管理技士、1級建築士" />
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-1.5 font-medium">経験年数</label>
          <select className="w-full px-4 py-3 border border-gray-200 text-sm focus:outline-none focus:border-[#1B3A5C] appearance-none bg-white">
            <option value="">選択してください</option>
            <option>1〜3年</option>
            <option>3〜5年</option>
            <option>5〜10年</option>
            <option>10〜20年</option>
            <option>20年以上</option>
          </select>
        </div>

        {/* File uploads */}
        <div className="space-y-4 pt-2">
          <p className="text-[#1B3A5C] text-sm font-bold">書類アップロード</p>

          {/* 履歴書 */}
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 font-medium">履歴書 <span className="text-red-400">*</span></label>
            <input ref={resumeRef} type="file" accept=".pdf,.doc,.docx" onChange={(e) => handleFileChange(e, setResumeFile)} className="hidden" />
            <button
              type="button"
              onClick={() => resumeRef.current?.click()}
              className={`w-full flex items-center gap-3 px-4 py-4 border-2 border-dashed transition-colors text-sm ${
                resumeFile ? "border-[#1B3A5C]/30 bg-[#F0F4F8]" : "border-gray-200 hover:border-[#1B3A5C]/20"
              }`}
            >
              {resumeFile ? (
                <>
                  <FileText className="w-5 h-5 text-[#1B3A5C]" />
                  <span className="text-[#1B3A5C] font-medium">{resumeFile}</span>
                  <Check className="w-4 h-4 text-[#7BA23F] ml-auto" />
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-500">履歴書をアップロード</span>
                  <span className="text-gray-300 text-xs ml-auto">PDF / Word</span>
                </>
              )}
            </button>
          </div>

          {/* 職務経歴書 */}
          <div>
            <label className="block text-xs text-gray-500 mb-1.5 font-medium">職務経歴書 <span className="text-red-400">*</span></label>
            <input ref={cvRef} type="file" accept=".pdf,.doc,.docx" onChange={(e) => handleFileChange(e, setCvFile)} className="hidden" />
            <button
              type="button"
              onClick={() => cvRef.current?.click()}
              className={`w-full flex items-center gap-3 px-4 py-4 border-2 border-dashed transition-colors text-sm ${
                cvFile ? "border-[#1B3A5C]/30 bg-[#F0F4F8]" : "border-gray-200 hover:border-[#1B3A5C]/20"
              }`}
            >
              {cvFile ? (
                <>
                  <FileText className="w-5 h-5 text-[#1B3A5C]" />
                  <span className="text-[#1B3A5C] font-medium">{cvFile}</span>
                  <Check className="w-4 h-4 text-[#7BA23F] ml-auto" />
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-500">職務経歴書をアップロード</span>
                  <span className="text-gray-300 text-xs ml-auto">PDF / Word</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* 志望動機 */}
        <div>
          <label className="block text-xs text-gray-500 mb-1.5 font-medium">志望動機・自己PR</label>
          <textarea rows={5} className="w-full px-4 py-3 border border-gray-200 text-sm focus:outline-none focus:border-[#1B3A5C] resize-none" placeholder="これまでの経験や当社で実現したいことをお書きください。" />
        </div>

        <div className="pt-2">
          <button type="submit" className="w-full py-4 bg-[#1B3A5C] text-white font-bold text-sm tracking-wider hover:bg-[#2A5080] transition-colors">
            応募する
          </button>
          <p className="text-gray-400 text-xs text-center mt-3">
            ※ 応募いただいた個人情報は採用選考以外の目的では使用しません
          </p>
        </div>
      </form>
    </motion.div>
  );
}

/* ═══════ Page ═══════ */
export default function RecruitPage() {
  const [selectedJob, setSelectedJob] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);

  const activeJob = JOBS.find((j) => j.id === selectedJob);

  return (
    <>
      <Header />

      <main className="bg-[#F0F4F8] min-h-screen">
        {/* Hero */}
        <section className="bg-[#1B3A5C] py-16 sm:py-20 px-5">
          <div className="max-w-[1000px] mx-auto text-center">
            <motion.p className="text-[#C8A96E] text-xs tracking-[0.3em] mb-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>RECRUIT</motion.p>
            <motion.h1 className="text-white font-bold text-2xl sm:text-4xl mb-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              一緒に未来をつくる仲間を
              <br />募集しています
            </motion.h1>
            <motion.p className="text-white/50 text-sm max-w-[500px] mx-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              {COMPANY.name}は創業50年。確かな技術と信頼で、<br />地域社会に貢献する建設会社です。
            </motion.p>
          </div>
        </section>

        <div className="max-w-[1000px] mx-auto px-5 py-10 sm:py-14">
          {/* Benefits */}
          <motion.div className="bg-white border border-gray-200 p-6 sm:p-8 mb-10" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
            <h2 className="text-[#1B3A5C] font-bold text-lg mb-5 flex items-center gap-2">
              <Shield className="w-5 h-5 text-[#C8A96E]" /> 福利厚生
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {BENEFITS.map((b) => (
                <div key={b} className="flex items-center gap-2 text-sm text-gray-600">
                  <Check className="w-3.5 h-3.5 text-[#1B3A5C] flex-shrink-0" strokeWidth={2} />
                  {b}
                </div>
              ))}
            </div>
          </motion.div>

          {applying && activeJob ? (
            /* Application form */
            <ApplicationForm job={activeJob} onClose={() => { setApplying(false); setSelectedJob(null); }} />
          ) : selectedJob && activeJob ? (
            /* Job detail */
            <JobDetail job={activeJob} onApply={() => setApplying(true)} />
          ) : (
            /* Job listing */
            <>
              <h2 className="text-[#1B3A5C] font-bold text-lg mb-6">募集職種</h2>
              <div className="space-y-4">
                {JOBS.map((job, i) => (
                  <motion.div
                    key={job.id}
                    className="bg-white border border-gray-200 p-6 hover:shadow-lg hover:border-[#1B3A5C]/20 transition-all cursor-pointer group"
                    onClick={() => setSelectedJob(job.id)}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2.5 py-0.5 bg-[#1B3A5C] text-white text-[10px]">{job.type}</span>
                      <span className="text-gray-400 text-xs">{job.location}</span>
                    </div>
                    <h3 className="text-[#1B3A5C] font-bold text-lg group-hover:text-[#2A5080] transition-colors">{job.title}</h3>
                    <p className="text-gray-500 text-sm mt-1 mb-3">{job.description}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[#C8A96E] text-sm">{job.salary}</span>
                      <span className="text-[#1B3A5C] text-sm font-medium group-hover:underline">詳しく見る →</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          )}

          {/* Contact */}
          <motion.div className="mt-10 p-6 bg-white border border-gray-200 text-center" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <p className="text-gray-500 text-sm mb-3">採用に関するお問い合わせ</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href={`tel:${COMPANY.phone}`} className="flex items-center gap-2 text-[#1B3A5C] font-bold">
                <Phone className="w-4 h-4" /> {COMPANY.phone}
              </a>
              <a href={`mailto:${COMPANY.email}`} className="flex items-center gap-2 text-[#1B3A5C]">
                <Mail className="w-4 h-4" /> {COMPANY.email}
              </a>
            </div>
          </motion.div>
        </div>
      </main>
    </>
  );
}
