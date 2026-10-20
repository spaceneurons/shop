"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function InfoView({
  kicker,
  title,
  lead,
  blocks,
  form,
}: {
  kicker: string;
  title: string;
  lead: string;
  blocks: { title: string; text: string }[];
  form?: boolean;
}) {
  const reduce = useReducedMotion();
  const [sent, setSent] = useState(false);
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  return (
    <div className="mx-auto w-full max-w-[1024px] px-4 py-10 sm:px-[35px]">
      <motion.div initial={reduce ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-[12px] tracking-[0.14em] text-[#8e8e93] uppercase">{kicker}</p>
        <h1 className="mt-2 max-w-xl text-[36px] leading-none font-medium tracking-[-0.03em]">{title}</h1>
        <p className="mt-4 max-w-xl text-[15px] leading-6 text-[#3a3a40]">{lead}</p>
      </motion.div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {blocks.map((block, index) => (
          <motion.article
            key={block.title}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.06 * index }}
            className="rounded-2xl bg-white p-5"
          >
            <h2 className="text-[16px] font-medium">{block.title}</h2>
            <p className="mt-2 text-[14px] leading-6 text-[#4a4a50]">{block.text}</p>
          </motion.article>
        ))}
      </div>
      {form && (
        <form
          className="mt-6 max-w-lg rounded-2xl bg-white p-5"
          onSubmit={(event) => {
            event.preventDefault();
            if (name.trim().length < 2 || contact.trim().length < 4 || message.trim().length < 8) {
              setError("Напишите имя, как с вами связаться и коротко, о чём вопрос.");
              return;
            }
            setError("");
            setSent(true);
          }}
        >
          <h2 className="text-[16px] font-medium">Написать нам</h2>
          {sent ? (
            <p className="mt-3 text-[14px] leading-6 text-[#3a3a40]">
              Сообщение осталось на этой странице: в демонстрации письма не уходят. {name}, спасибо, что написали.
            </p>
          ) : (
            <div className="mt-3 grid gap-3">
              <Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Имя" className="h-10 rounded-xl" />
              <Input value={contact} onChange={(event) => setContact(event.target.value)} placeholder="Почта или телефон" className="h-10 rounded-xl" />
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Сообщение"
                className="min-h-28 rounded-xl border border-input bg-transparent px-3 py-2 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              />
              {error && <p className="text-[13px] text-[#8d3034]">{error}</p>}
              <Button type="submit" className="w-fit rounded-full">
                Отправить
              </Button>
            </div>
          )}
        </form>
      )}
    </div>
  );
}
