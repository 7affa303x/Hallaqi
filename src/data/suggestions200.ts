export type SuggestionPriority = 'critical' | 'important' | 'nice';

export interface SuggestionItem {
  number: number;
  priority: SuggestionPriority;
  text: string;
}

export interface SuggestionSection {
  title: string;
  items: SuggestionItem[];
}

export const SUGGESTIONS_200_SECTIONS: SuggestionSection[] = [
  {
    "title": "1) الهيكل العام والمنصة (25)",
    "items": [
      {
        "number": 1,
        "priority": "critical",
        "text": "توحيد مصدر الحقيقة لـ `SITE_URL` في كل الـ API والـ PWA."
      },
      {
        "number": 2,
        "priority": "critical",
        "text": "مراقبة أخطاء الإنتاج (Sentry أو ما يعادله) مع عينات عربية."
      },
      {
        "number": 3,
        "priority": "critical",
        "text": "لوحة حالة إطلاق (`/status`) للصحة وقاعدة البيانات والـ AI."
      },
      {
        "number": 4,
        "priority": "important",
        "text": "فصل حزم الموبايل (Capacitor) عن الـ SPA تدريجياً."
      },
      {
        "number": 5,
        "priority": "important",
        "text": "تفعيل Partial SSR/Prerender لصفحات الحلاق والمنتج."
      },
      {
        "number": 6,
        "priority": "important",
        "text": "طبقة Feature Flags على الخادم وليس الواجهة فقط."
      },
      {
        "number": 7,
        "priority": "important",
        "text": "بيئات منفصلة: staging / production مع بيانات وهمية معزولة."
      },
      {
        "number": 8,
        "priority": "important",
        "text": "عقود API موحّدة (OpenAPI) لكل `/api/*`."
      },
      {
        "number": 9,
        "priority": "important",
        "text": "سياسات RLS مراجعة دورية + اختبارات أمنية آلية."
      },
      {
        "number": 10,
        "priority": "important",
        "text": "نسخ احتياطي يومي لـ Supabase مع تجربة استعادة."
      },
      {
        "number": 11,
        "priority": "nice",
        "text": "Monorepo خفيف لـ `web` / `api` / `docs`."
      },
      {
        "number": 12,
        "priority": "nice",
        "text": "تصميم نظام Tokens كامل (مسافات، ظلال، كثافة)."
      },
      {
        "number": 13,
        "priority": "nice",
        "text": "Storybook لمكوّنات الحجز والبطاقات."
      },
      {
        "number": 14,
        "priority": "nice",
        "text": "دليل مساهمة للمطورين بالدارجة/العربية."
      },
      {
        "number": 15,
        "priority": "nice",
        "text": "قياس Core Web Vitals على شبكات جزائرية حقيقية."
      },
      {
        "number": 16,
        "priority": "nice",
        "text": "Edge caching للـ sitemap والـ capabilities."
      },
      {
        "number": 17,
        "priority": "nice",
        "text": "فصل منطق الأعمال عن مكوّنات React (use-cases)."
      },
      {
        "number": 18,
        "priority": "nice",
        "text": "مكتبة أيقونات موحّدة بدون تكرار imports."
      },
      {
        "number": 19,
        "priority": "nice",
        "text": "اختبارات عقدية لـ Supabase RPC."
      },
      {
        "number": 20,
        "priority": "nice",
        "text": "سجل تغييرات المستخدم (`CHANGELOG` داخل التطبيق)."
      },
      {
        "number": 21,
        "priority": "nice",
        "text": "وضع صيانة مجدول برسالة عربية/فرنسية."
      },
      {
        "number": 22,
        "priority": "nice",
        "text": "حد معدّل طلبات عام على كل الـ API."
      },
      {
        "number": 23,
        "priority": "nice",
        "text": "تدقيق تبعيات أسبوعياً (`npm audit` في CI)."
      },
      {
        "number": 24,
        "priority": "nice",
        "text": "خريطة معمارية محدّثة في `docs/`."
      },
      {
        "number": 25,
        "priority": "nice",
        "text": "قائمة تحقق إطلاق قبل كل نشر."
      }
    ]
  },
  {
    "title": "2) صفحة الحجز والاكتشاف (25)",
    "items": [
      {
        "number": 26,
        "priority": "critical",
        "text": "بحث جغرافي حقيقي بالمسافة من GPS."
      },
      {
        "number": 27,
        "priority": "critical",
        "text": "فلتر «مفتوح الآن» حسب جدول العمل."
      },
      {
        "number": 28,
        "priority": "critical",
        "text": "إخفاء الحلاقين بدون خدمات فعّالة من السيرفر أيضاً."
      },
      {
        "number": 29,
        "priority": "important",
        "text": "ترتيب حسب «الأقرب + التقييم + التوفر»."
      },
      {
        "number": 30,
        "priority": "important",
        "text": "بطاقة حلاق تعرض أول موعد متاح."
      },
      {
        "number": 31,
        "priority": "important",
        "text": "حفظ فلاتر الولاية محلياً ومزامنتها مع الحساب."
      },
      {
        "number": 32,
        "priority": "important",
        "text": "خريطة تجميعية (clusters) للحلاقين."
      },
      {
        "number": 33,
        "priority": "important",
        "text": "اقتراحات بحث ذكية (خدمات شائعة)."
      },
      {
        "number": 34,
        "priority": "important",
        "text": "وضع «حلاق متنقل فقط»."
      },
      {
        "number": 35,
        "priority": "important",
        "text": "مقارنة سريعة بين 2–3 حلاقين."
      },
      {
        "number": 36,
        "priority": "nice",
        "text": "سكيلتون أوضح أثناء التحميل البطيء."
      },
      {
        "number": 37,
        "priority": "nice",
        "text": "شارات ثقة: موثّق، سريع الرد، نسبة قبول."
      },
      {
        "number": 38,
        "priority": "nice",
        "text": "فلتر الميزانية بشريط منزلق."
      },
      {
        "number": 39,
        "priority": "nice",
        "text": "عرض سعر تقريبي بالعملة المختارة على البطاقة دائماً."
      },
      {
        "number": 40,
        "priority": "nice",
        "text": "قائمة «زرتهم مؤخراً»."
      },
      {
        "number": 41,
        "priority": "nice",
        "text": "تنبيه عند انقطاع الشبكة أثناء التصفية."
      },
      {
        "number": 42,
        "priority": "nice",
        "text": "مشاركة رابط بحث مفلتر."
      },
      {
        "number": 43,
        "priority": "nice",
        "text": "وضع قائمة/شبكة قابل للتبديل."
      },
      {
        "number": 44,
        "priority": "nice",
        "text": "تمييز الحلاقين المفضلين بصرياً أقوى."
      },
      {
        "number": 45,
        "priority": "nice",
        "text": "عدّاد نتائج حي («12 حلاقاً»)."
      },
      {
        "number": 46,
        "priority": "nice",
        "text": "اقتراح ولاية تلقائي من البلد المختار."
      },
      {
        "number": 47,
        "priority": "nice",
        "text": "فلتر مدة الخدمة القصوى."
      },
      {
        "number": 48,
        "priority": "nice",
        "text": "إبراز عروض اليوم بدون بطاقات مزدحمة."
      },
      {
        "number": 49,
        "priority": "nice",
        "text": "تجربة فارغة محفّزة («كن أول حلاق في ولايتك»)."
      },
      {
        "number": 50,
        "priority": "nice",
        "text": "تحليل نقرات الاكتشاف لتحسين الترتيب."
      }
    ]
  },
  {
    "title": "3) تدفق الحجز (Booking Flow) (20)",
    "items": [
      {
        "number": 51,
        "priority": "critical",
        "text": "منع الحجز المزدوج لنفس الفترة على الخادم بقوة."
      },
      {
        "number": 52,
        "priority": "critical",
        "text": "تأكيد SMS/إشعار عند قبول الحلاق."
      },
      {
        "number": 53,
        "priority": "critical",
        "text": "سياسة إلغاء واضحة في كل خطوة."
      },
      {
        "number": 54,
        "priority": "important",
        "text": "اختيار عدة خدمات مع فحص تعارض المدد."
      },
      {
        "number": 55,
        "priority": "important",
        "text": "اقتراح أفضل 3 أوقات حسب خوارزمية الجدولة."
      },
      {
        "number": 56,
        "priority": "important",
        "text": "تذكير نقدي بعملة العرض + تنويه DZD للتسوية."
      },
      {
        "number": 57,
        "priority": "important",
        "text": "حفظ مسودة الحجز عند انقطاع الشبكة."
      },
      {
        "number": 58,
        "priority": "important",
        "text": "إعادة جدولة بضغطة من المواعيد."
      },
      {
        "number": 59,
        "priority": "nice",
        "text": "تقدير زمن الوصول للخدمة المنزلية."
      },
      {
        "number": 60,
        "priority": "nice",
        "text": "ملاحظات خاصة للحلاق مع قوالب جاهزة."
      },
      {
        "number": 61,
        "priority": "nice",
        "text": "مشاركة تفاصيل الموعد عبر WhatsApp."
      },
      {
        "number": 62,
        "priority": "nice",
        "text": "رمز QR للموعد عند الوصول."
      },
      {
        "number": 63,
        "priority": "nice",
        "text": "عدّ تنازلي قبل الموعد."
      },
      {
        "number": 64,
        "priority": "nice",
        "text": "قائمة انتظار عند امتلاء اليوم."
      },
      {
        "number": 65,
        "priority": "nice",
        "text": "حجوزات متكررة (كل أسبوعين)."
      },
      {
        "number": 66,
        "priority": "nice",
        "text": "تأكيد حضور العميل قبل ساعة."
      },
      {
        "number": 67,
        "priority": "nice",
        "text": "ربط الحجز بمحفظة صور مرجعية."
      },
      {
        "number": 68,
        "priority": "nice",
        "text": "تقييم إجباري لطيف بعد الإكمال."
      },
      {
        "number": 69,
        "priority": "nice",
        "text": "ملخص PDF بسيط للموعد."
      },
      {
        "number": 70,
        "priority": "nice",
        "text": "تجربة حجز لضيف (بدون حساب) لاحقاً بحذر."
      }
    ]
  },
  {
    "title": "4) واجهة الحلاق / الاستوديو (20)",
    "items": [
      {
        "number": 71,
        "priority": "critical",
        "text": "أجندة يوم واضحة مع Walk-in."
      },
      {
        "number": 72,
        "priority": "critical",
        "text": "قبول/رفض الحجز بإشعار فوري للعميل."
      },
      {
        "number": 73,
        "priority": "critical",
        "text": "إدارة الخدمات والأسعار بدون أخطاء تحقق."
      },
      {
        "number": 74,
        "priority": "important",
        "text": "وضع مشغول/متاح بزر واحد."
      },
      {
        "number": 75,
        "priority": "important",
        "text": "إحصائيات يومية: إيراد، حضور، إلغاء."
      },
      {
        "number": 76,
        "priority": "important",
        "text": "قوالب ردود جاهزة بالعربية/الفرنسية."
      },
      {
        "number": 77,
        "priority": "important",
        "text": "مساعد الحلاق مربوط بمواعيد اليوم فقط."
      },
      {
        "number": 78,
        "priority": "nice",
        "text": "معرض أعمال مع ترتيب سحب."
      },
      {
        "number": 79,
        "priority": "nice",
        "text": "تنبيهات نقص التوفر الأسبوعي."
      },
      {
        "number": 80,
        "priority": "nice",
        "text": "طباعة/مشاركة جدول اليوم."
      },
      {
        "number": 81,
        "priority": "nice",
        "text": "إدارة الاستثناءات (أعياد، مرض)."
      },
      {
        "number": 82,
        "priority": "nice",
        "text": "قائمة عملاء متكررين."
      },
      {
        "number": 83,
        "priority": "nice",
        "text": "ملاحظات خاصة لكل عميل."
      },
      {
        "number": 84,
        "priority": "nice",
        "text": "تسعير موسمي سريع."
      },
      {
        "number": 85,
        "priority": "nice",
        "text": "وضع فريق متعدد الكراسي لاحقاً."
      },
      {
        "number": 86,
        "priority": "nice",
        "text": "تتبع زمن الرد على الطلبات."
      },
      {
        "number": 87,
        "priority": "nice",
        "text": "شارة «يرد خلال 15 دقيقة»."
      },
      {
        "number": 88,
        "priority": "nice",
        "text": "استيراد خدمات من قالب صالون."
      },
      {
        "number": 89,
        "priority": "nice",
        "text": "تنبيه خدمات بأسعار غير منطقية."
      },
      {
        "number": 90,
        "priority": "nice",
        "text": "دليل بدء سريع للحلاق الجديد."
      }
    ]
  },
  {
    "title": "5) الملف الشخصي والإعدادات / i18n (15)",
    "items": [
      {
        "number": 91,
        "priority": "critical",
        "text": "إكمال كل النصوص الظاهرة في fr/en (لا خليط)."
      },
      {
        "number": 92,
        "priority": "critical",
        "text": "مزامنة البلد/العملة مع الحساب على الخادم."
      },
      {
        "number": 93,
        "priority": "important",
        "text": "محوّل لغة من الشاشة الأولى قبل التسجيل."
      },
      {
        "number": 94,
        "priority": "important",
        "text": "اتجاه RTL/LTR لكل الشاشات الفرعية."
      },
      {
        "number": 95,
        "priority": "important",
        "text": "ترجمة رسائل أخطاء API."
      },
      {
        "number": 96,
        "priority": "nice",
        "text": "تفضيل لغة الإشعارات منفصل."
      },
      {
        "number": 97,
        "priority": "nice",
        "text": "اختيار اللهجة (فصحى/دارجة) لاحقاً."
      },
      {
        "number": 98,
        "priority": "nice",
        "text": "تنسيق أرقام الهاتف حسب البلد."
      },
      {
        "number": 99,
        "priority": "nice",
        "text": "عناوين الولايات حسب البلد المختار."
      },
      {
        "number": 100,
        "priority": "nice",
        "text": "صفحة إعدادات منطقة واحدة (لغة+بلد+عملة)."
      },
      {
        "number": 101,
        "priority": "nice",
        "text": "اختبار لقطات UI لكل لغة في CI."
      },
      {
        "number": 102,
        "priority": "nice",
        "text": "قاموس مصطلحات الحلاقة ثلاثي اللغة."
      },
      {
        "number": 103,
        "priority": "nice",
        "text": "احترام لغة جهاز المستخدم عند أول فتح."
      },
      {
        "number": 104,
        "priority": "nice",
        "text": "ترجمة محتوى المساعدة القانونية."
      },
      {
        "number": 105,
        "priority": "nice",
        "text": "تلميحات عملة أوضح «عرض فقط»."
      }
    ]
  },
  {
    "title": "6) السوق (Marketplace) (15)",
    "items": [
      {
        "number": 106,
        "priority": "critical",
        "text": "بطاقات منتجات بلا بيانات ناقصة ظاهرة."
      },
      {
        "number": 107,
        "priority": "critical",
        "text": "Visit Store مع تحذير مغادرة واضح بكل اللغات."
      },
      {
        "number": 108,
        "priority": "important",
        "text": "بحث منتجات بالعملة المعروضة."
      },
      {
        "number": 109,
        "priority": "important",
        "text": "فلاتر ولايات البائعين."
      },
      {
        "number": 110,
        "priority": "important",
        "text": "أدوات AI للقوائم بلغات متعددة."
      },
      {
        "number": 111,
        "priority": "nice",
        "text": "شارة بائع موثوق."
      },
      {
        "number": 112,
        "priority": "nice",
        "text": "منتج اليوم بشفافية (إعلان مدفوع لاحقاً)."
      },
      {
        "number": 113,
        "priority": "nice",
        "text": "حفظ منتجات على الجهاز."
      },
      {
        "number": 114,
        "priority": "nice",
        "text": "مقارنة منتجات متشابهة."
      },
      {
        "number": 115,
        "priority": "nice",
        "text": "صفحات فئة SEO ثابتة."
      },
      {
        "number": 116,
        "priority": "nice",
        "text": "تقييمات موثّقة بعد زيارة."
      },
      {
        "number": 117,
        "priority": "nice",
        "text": "تنبيه تغيّر سعر المنتج."
      },
      {
        "number": 118,
        "priority": "nice",
        "text": "كتالوج شركات/أطباء أوضح فصلًا."
      },
      {
        "number": 119,
        "priority": "nice",
        "text": "حد تحميل صور مضغوط دائماً."
      },
      {
        "number": 120,
        "priority": "nice",
        "text": "لوحة بائع بإحصاءات حقيقية فقط."
      }
    ]
  },
  {
    "title": "7) المساعد الذكي (15)",
    "items": [
      {
        "number": 121,
        "priority": "critical",
        "text": "ربط الإجابة دائماً بحلاقين حقيقيين عند السؤال عن الحجز."
      },
      {
        "number": 122,
        "priority": "critical",
        "text": "رفض التشخيص الطبي بصرامة متعددة اللغات."
      },
      {
        "number": 123,
        "priority": "important",
        "text": "ذاكرة قصيرة لآخر 3 أسئلة في الجلسة."
      },
      {
        "number": 124,
        "priority": "important",
        "text": "اقتراح فتح صفحة حلاق من الإجابة."
      },
      {
        "number": 125,
        "priority": "important",
        "text": "وضع «اشرح لي بالدارجة/الفرنسية»."
      },
      {
        "number": 126,
        "priority": "nice",
        "text": "حد يومي أوضح في الواجهة."
      },
      {
        "number": 127,
        "priority": "nice",
        "text": "أمثلة أسئلة حسب اللغة."
      },
      {
        "number": 128,
        "priority": "nice",
        "text": "تقييم مفيد/غير مفيد للنصيحة."
      },
      {
        "number": 129,
        "priority": "nice",
        "text": "سياق الطقس/الموسم الجزائري."
      },
      {
        "number": 130,
        "priority": "nice",
        "text": "اقتراح منتجات سوق مرتبطة بحذر."
      },
      {
        "number": 131,
        "priority": "nice",
        "text": "وضع الحلاق المساعد بسياق الموعد فقط."
      },
      {
        "number": 132,
        "priority": "nice",
        "text": "تسجيل جودة JSON للإصلاح المستمر."
      },
      {
        "number": 133,
        "priority": "nice",
        "text": "نماذج أخف للأجهزة الضعيفة."
      },
      {
        "number": 134,
        "priority": "nice",
        "text": "كاش لإجابات FAQ المتكررة."
      },
      {
        "number": 135,
        "priority": "nice",
        "text": "لوحة أدمن لجودة المساعد."
      }
    ]
  },
  {
    "title": "8) المدفوعات والثقة (15)",
    "items": [
      {
        "number": 136,
        "priority": "critical",
        "text": "مسار نقدي كامل مع تأكيد حضور."
      },
      {
        "number": 137,
        "priority": "critical",
        "text": "عدم إظهار Stripe كخيار رئيسي في الجزائر."
      },
      {
        "number": 138,
        "priority": "important",
        "text": "تكامل CCP/Baridi عند جاهزية قانونية."
      },
      {
        "number": 139,
        "priority": "important",
        "text": "إيصالات واضحة للعميل والحلاق."
      },
      {
        "number": 140,
        "priority": "important",
        "text": "سجل مدفوعات مبسّط."
      },
      {
        "number": 141,
        "priority": "nice",
        "text": "تذكير بالمبلغ قبل الزيارة."
      },
      {
        "number": 142,
        "priority": "nice",
        "text": "دعم إيداع جزئي لاحقاً."
      },
      {
        "number": 143,
        "priority": "nice",
        "text": "حماية من أسعار اختبار في الإنتاج."
      },
      {
        "number": 144,
        "priority": "nice",
        "text": "شارة «الدفع عند الزيارة فقط»."
      },
      {
        "number": 145,
        "priority": "nice",
        "text": "سياسة استرداد مكتوبة ببساطة."
      },
      {
        "number": 146,
        "priority": "nice",
        "text": "تنبيهات احتيال بسيطة للأدمن."
      },
      {
        "number": 147,
        "priority": "nice",
        "text": "مطابقة المبلغ في الإشعار."
      },
      {
        "number": 148,
        "priority": "nice",
        "text": "تجربة فشل دفع لطيفة."
      },
      {
        "number": 149,
        "priority": "nice",
        "text": "اختبارات مزوّد دفع وهمية."
      },
      {
        "number": 150,
        "priority": "nice",
        "text": "توثيق قانوني لوسائل الدفع المعتمدة."
      }
    ]
  },
  {
    "title": "9) المنتدى والمجتمع (10)",
    "items": [
      {
        "number": 151,
        "priority": "important",
        "text": "تغذية أفضل بدون منشورات فارغة."
      },
      {
        "number": 152,
        "priority": "important",
        "text": "إبلاغ عن محتوى مسيء بسهولة."
      },
      {
        "number": 153,
        "priority": "nice",
        "text": "مسابقات بصور قبل/بعد واضحة."
      },
      {
        "number": 154,
        "priority": "nice",
        "text": "وسوم خدمات مرتبطة بالحجز."
      },
      {
        "number": 155,
        "priority": "nice",
        "text": "ترجمة آلية اختيارية للتعليقات."
      },
      {
        "number": 156,
        "priority": "nice",
        "text": "تثبيت منشورات مفيدة."
      },
      {
        "number": 157,
        "priority": "nice",
        "text": "ملف كاتب أوضح."
      },
      {
        "number": 158,
        "priority": "nice",
        "text": "منع السبام بالحدود."
      },
      {
        "number": 159,
        "priority": "nice",
        "text": "إشعارات ردود قابلة للتعطيل."
      },
      {
        "number": 160,
        "priority": "nice",
        "text": "بحث داخل المنتدى."
      }
    ]
  },
  {
    "title": "10) الأداء والموبايل/PWA (15)",
    "items": [
      {
        "number": 161,
        "priority": "critical",
        "text": "تقليل JS الأولي أكثر (تحليل bundle)."
      },
      {
        "number": 162,
        "priority": "critical",
        "text": "صور WebP/AVIF مع أحجام متعددة."
      },
      {
        "number": 163,
        "priority": "important",
        "text": "Service Worker لصفحات الحجز الأساسية Offline."
      },
      {
        "number": 164,
        "priority": "important",
        "text": "تحسين TTFB عبر منطقة أقرب."
      },
      {
        "number": 165,
        "priority": "nice",
        "text": "Prefetch لتبويب المواعيد بعد الدخول."
      },
      {
        "number": 166,
        "priority": "nice",
        "text": "تقليل حركة Framer على الأجهزة الضعيفة."
      },
      {
        "number": 167,
        "priority": "nice",
        "text": "اختبارات Lighthouse في CI."
      },
      {
        "number": 168,
        "priority": "nice",
        "text": "خطوط محلية بدل Google عند الحاجة."
      },
      {
        "number": 169,
        "priority": "nice",
        "text": "ضغط إضافي للـ JSON-LD."
      },
      {
        "number": 170,
        "priority": "nice",
        "text": "شاشات PWA حقيقية بدل شعارات فقط."
      },
      {
        "number": 171,
        "priority": "nice",
        "text": "تثبيت التطبيق بخطوات عربية."
      },
      {
        "number": 172,
        "priority": "nice",
        "text": "وضع بيانات منخفضة."
      },
      {
        "number": 173,
        "priority": "nice",
        "text": "إلغاء تحميل الخرائط حتى الطلب."
      },
      {
        "number": 174,
        "priority": "nice",
        "text": "قياس استهلاك البيانات لكل جلسة."
      },
      {
        "number": 175,
        "priority": "nice",
        "text": "تحسين أول تفاعل على 3G."
      }
    ]
  },
  {
    "title": "11) الأمان والخصوصية والقانون (10)",
    "items": [
      {
        "number": 176,
        "priority": "critical",
        "text": "سياسة خصوصية مطابقة 18-07 ظاهرة وسهلة."
      },
      {
        "number": 177,
        "priority": "critical",
        "text": "موافقة صريحة على التحليلات بكل لغة."
      },
      {
        "number": 178,
        "priority": "important",
        "text": "سجل موافقات المستخدم."
      },
      {
        "number": 179,
        "priority": "important",
        "text": "حذف حساب فعلي كامل البيانات."
      },
      {
        "number": 180,
        "priority": "nice",
        "text": "تصدير بيانات المستخدم."
      },
      {
        "number": 181,
        "priority": "nice",
        "text": "MFA أوضح لغير الأدمن الاختياري."
      },
      {
        "number": 182,
        "priority": "nice",
        "text": "Mentions légales كاملة."
      },
      {
        "number": 183,
        "priority": "nice",
        "text": "تقارير أمان فصلية."
      },
      {
        "number": 184,
        "priority": "nice",
        "text": "تقليل صلاحيات service role."
      },
      {
        "number": 185,
        "priority": "nice",
        "text": "إخفاء PII من السجلات."
      }
    ]
  },
  {
    "title": "12) النمو والعمليات ومحتوى السوق الجزائري (15)",
    "items": [
      {
        "number": 186,
        "priority": "critical",
        "text": "اكتساب 10–20 حلاقاً حقيقياً في ولاية واحدة أولاً."
      },
      {
        "number": 187,
        "priority": "critical",
        "text": "إزالة أي بيانات تجريبية متبقية يدوياً من DB."
      },
      {
        "number": 188,
        "priority": "important",
        "text": "دليل الحلاق: كيف تستقبل أول حجز."
      },
      {
        "number": 189,
        "priority": "important",
        "text": "حملات محتوى تيكتوك/إنستغرام محلية."
      },
      {
        "number": 190,
        "priority": "important",
        "text": "دعم فرنسية للمستخدمين في المدن الكبرى."
      },
      {
        "number": 191,
        "priority": "nice",
        "text": "شراكات مع مدارس الحلاقة."
      },
      {
        "number": 192,
        "priority": "nice",
        "text": "برنامج إحالة بسيط (لاحقاً)."
      },
      {
        "number": 193,
        "priority": "nice",
        "text": "صفحة «لماذا حلاقي؟» قصيرة ومقنعة."
      },
      {
        "number": 194,
        "priority": "nice",
        "text": "شهادات عملاء حقيقية."
      },
      {
        "number": 195,
        "priority": "nice",
        "text": "تقويم مواسم (العيد، الدخول المدرسي)."
      },
      {
        "number": 196,
        "priority": "nice",
        "text": "دليل ولايات تدريجي للتوسع."
      },
      {
        "number": 197,
        "priority": "nice",
        "text": "قياس الاحتفاظ الأسبوعي."
      },
      {
        "number": 198,
        "priority": "nice",
        "text": "قناة دعم واضحة (بريد + لاحقاً واتساب)."
      },
      {
        "number": 199,
        "priority": "nice",
        "text": "لوحة قرارات أسبوعية للمنتج."
      },
      {
        "number": 200,
        "priority": "nice",
        "text": "خارطة طريق عامة شفافة للمستخدمين."
      }
    ]
  }
];

export const SUGGESTIONS_200_NOTE = "الدفع الإلكتروني المحلي وOTP بالهاتف وSSR الكامل ما زالت تتطلب تكاملات خارجية؛ بقية البنود أعلاه قابلة للتنفيذ تدريجياً داخل المنتج.";
