import type { Metadata } from "next";
import { InfoView } from "@/components/info-view";

export const metadata: Metadata = { title: "Контакты" };

export default function ContactsPage() {
  return (
    <InfoView
      kicker="Контакты"
      title="Напишите, если нужна помощь с размером"
      lead="Отвечаем в будни с 10:00 до 19:00 по Москве. По заказам лучше сразу указать номер — так быстрее найдём вещь."
      form
      blocks={[
        {
          title: "Почта",
          text: "hello@lumi.store — для заказов, обмена и вопросов по ткани.",
        },
        {
          title: "Шоурум",
          text: "Москва, Патриаршие пруды. Примерка по записи, без витринной очереди.",
        },
        {
          title: "Телефон",
          text: "+7 495 000-00-00. Если не берём трубку, напишите — перезвоним в тот же день.",
        },
        {
          title: "Соцсети",
          text: "Короткие заметки о посадке и новых партиях. Ссылки в подвале ведут сюда, пока каналы не подключены.",
        },
      ]}
    />
  );
}
