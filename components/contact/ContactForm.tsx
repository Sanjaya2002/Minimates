"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";

const emptyForm = { name: "", email: "", subject: "", message: "" };

export function ContactForm() {
  const { toast } = useToast();
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sending, setSending] = useState(false);

  function set(field: keyof typeof emptyForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    if (errors[field]) setErrors((current) => ({ ...current, [field]: "" }));
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Please enter your name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = "Enter a valid email";
    if (!form.subject.trim()) next.subject = "Please add a subject";
    if (form.message.trim().length < 10) next.message = "Please write a little more";
    setErrors(next);
    if (Object.keys(next).length) return;

    setSending(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await response.json();
      if (!response.ok || !json.success) throw new Error(json.error);
      setForm(emptyForm);
      toast("Message sent! We'll get back to you soon.", "success");
    } catch (error) {
      toast(error instanceof Error ? error.message : "Could not send your message", "error");
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Name"
          name="name"
          required
          autoComplete="name"
          value={form.name}
          onChange={(event) => set("name", event.target.value)}
          error={errors.name}
        />
        <Input
          label="Email"
          name="email"
          type="email"
          required
          autoComplete="email"
          value={form.email}
          onChange={(event) => set("email", event.target.value)}
          error={errors.email}
        />
      </div>
      <Input
        label="Subject"
        name="subject"
        required
        value={form.subject}
        onChange={(event) => set("subject", event.target.value)}
        error={errors.subject}
      />
      <Textarea
        label="Message"
        name="message"
        required
        rows={6}
        value={form.message}
        onChange={(event) => set("message", event.target.value)}
        error={errors.message}
        hint="Tell us how we can help."
      />
      <Button type="submit" size="lg" loading={sending} className="sm:w-auto">
        Send message
      </Button>
    </form>
  );
}