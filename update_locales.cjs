const fs = require('fs');
const path = require('path');

const locales = ['uz', 'en', 'ru'];
const dir = path.join(__dirname, 'src', 'i18n');

locales.forEach(lang => {
  const filePath = path.join(dir, `${lang}.json`);
  let data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  if (!data.b2b) data.b2b = {};
  
  if (lang === 'uz') {
    data.b2b.city = "Shahar/Viloyat";
    data.b2b.business_types = {
      "shop": "Do'kon egasi",
      "team": "Sport jamoasi",
      "distributor": "Distribyutor"
    };
    data.pages = {
      "delivery_title": "Yetkazib berish",
      "delivery_content": "Biz O'zbekiston bo'ylab barcha hududlarga yetkazib beramiz. Toshkent shahri ichida 1 kun, boshqa viloyatlarga 2-3 ish kunida yetkaziladi.",
      "returns_title": "Mahsulotni qaytarish",
      "returns_content": "Agar mahsulot sizga mos kelmasa, 10 kun ichida qaytarishingiz yoki almashtirishingiz mumkin. Mahsulotning asl holati saqlangan bo'lishi kerak.",
      "contact_title": "Bog'lanish",
      "contact_content": "Savollaringiz bo'lsa biz bilan bog'laning:\\nTelefon: +998 90 123 45 67\\nManzil: Toshkent sh., Chilonzor tumani\\nTelegram: @mirvo_support"
    };
  } else if (lang === 'en') {
    data.b2b.city = "City/Region";
    data.b2b.business_types = {
      "shop": "Shop owner",
      "team": "Sports team",
      "distributor": "Distributor"
    };
    data.pages = {
      "delivery_title": "Delivery",
      "delivery_content": "We deliver to all regions across Uzbekistan. 1 day within Tashkent, 2-3 working days to other regions.",
      "returns_title": "Returns",
      "returns_content": "If the product doesn't fit, you can return or exchange it within 10 days. Original condition must be preserved.",
      "contact_title": "Contact Us",
      "contact_content": "If you have questions, please contact us:\\nPhone: +998 90 123 45 67\\nAddress: Tashkent city, Chilanzar district\\nTelegram: @mirvo_support"
    };
  } else if (lang === 'ru') {
    data.b2b.city = "Город/Область";
    data.b2b.business_types = {
      "shop": "Владелец магазина",
      "team": "Спортивная команда",
      "distributor": "Дистрибьютор"
    };
    data.pages = {
      "delivery_title": "Доставка",
      "delivery_content": "Мы доставляем во все регионы Узбекистана. 1 день по Ташкенту, 2-3 рабочих дня в другие регионы.",
      "returns_title": "Возврат",
      "returns_content": "Если товар не подошел, вы можете вернуть или обменять его в течение 10 дней. Первоначальное состояние должно быть сохранено.",
      "contact_title": "Контакты",
      "contact_content": "Если у вас есть вопросы, свяжитесь с нами:\\nТелефон: +998 90 123 45 67\\nАдрес: г. Ташкент, Чиланзарский район\\nTelegram: @mirvo_support"
    };
  }

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
});

console.log("Locales updated!");
