"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import {
  userProfileSchema,
  UserProfileFormData,
} from "@/lib/schemas/userProfileSchema";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/navigation";

export default function UserProfileForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<z.infer<typeof userProfileSchema>>({
    resolver: zodResolver(userProfileSchema),
  });

  const [preview, setPreview] = useState<string | null>(null);
  const imageFile = watch("storeImage");
  const router = useRouter();

  const onSubmit = async (data: UserProfileFormData) => {
    try {
      // 1. Upload da imagem para Supabase
      const file = data.storeImage[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${uuidv4()}.${fileExt}`;
      const filePath = `stores/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("catalogo")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("catalogo")
        .getPublicUrl(filePath);

      const imageUrl = publicUrlData.publicUrl;

      // 2. Envio dos dados para o backend
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyName: data.companyName,
          email: data.email,
          password: data.password,
          cnpj: data.cnpj,
          address: data.address,
          contact: data.contact,
          representativeName: data.representativeName,
          storeImageUrl: imageUrl,
        }),
      });

      if (!response.ok) throw new Error("Erro ao salvar usuário");

      router.push("/dashboard");
    } catch (error) {
      console.error("Erro ao enviar formulário", error);
    }
  };

  useEffect(() => {
    if (imageFile && imageFile.length > 0) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(imageFile[0]);
    }
  }, [imageFile]);

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-xl mx-auto p-6 border rounded-xl shadow bg-white space-y-4"
    >
      <h2 className="text-2xl font-bold mb-4">Cadastro de Perfil</h2>

      <div>
        <label className="block font-medium">Nome da empresa</label>
        <input type="text" {...register("companyName")} className="w-full border p-2 rounded" />
        {errors.companyName && <p className="text-red-500 text-sm">{errors.companyName.message}</p>}
      </div>

      <div>
        <label className="block font-medium">Nome do Representante</label>
        <input type="text" {...register("representativeName")} className="w-full border p-2 rounded" />
        {errors.representativeName && <p className="text-red-500 text-sm">{errors.representativeName.message}</p>}
      </div>

      <div>
        <label className="block font-medium">E-mail</label>
        <input type="email" {...register("email")} className="w-full border p-2 rounded" />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block font-medium">Senha</label>
        <input type="password" {...register("password")} className="w-full border p-2 rounded" />
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
      </div>

      <div>
        <label className="block font-medium">CNPJ</label>
        <input type="text" {...register("cnpj")} className="w-full border p-2 rounded" />
        {errors.cnpj && <p className="text-red-500 text-sm">{errors.cnpj.message}</p>}
      </div>

      <div>
        <label className="block font-medium">Endereço</label>
        <input type="text" {...register("address")} className="w-full border p-2 rounded" />
        {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
      </div>

      <div>
        <label className="block font-medium">Contato (telefone ou WhatsApp)</label>
        <input type="text" {...register("contact")} className="w-full border p-2 rounded" />
        {errors.contact && <p className="text-red-500 text-sm">{errors.contact.message}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-medium">Imagem do Estabelecimento</label>
        <div className="relative flex items-center justify-center w-full h-32 border-2 border-dashed border-zinc-300 rounded-lg bg-zinc-50 hover:bg-zinc-100 transition">
          <input
            type="file"
            accept="image/*"
            {...register("storeImage")}
            className="absolute inset-0 opacity-0 cursor-pointer z-10"
          />
          <div className="text-center pointer-events-none z-0">
            <p className="text-sm text-zinc-500">Clique para selecionar uma imagem</p>
            <p className="text-xs text-zinc-400">JPG, PNG ou WEBP até 5MB</p>
          </div>
        </div>
        {errors.storeImage && (
          <p className="text-red-500 text-sm">{errors.storeImage.message as string}</p>
        )}
        {preview && (
          <div className="relative w-40">
            <button
              type="button"
              onClick={() => {
                reset({ storeImage: null });
                setPreview(null);
              }}
              className="absolute right-2 top-2 bg-white rounded-full p-1 shadow"
            >
              ✕
            </button>
            <img src={preview} alt="Pré-visualização" className="mt-2 rounded-lg border object-cover w-full h-40" />
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary text-white py-2 rounded hover:bg-primary/90 transition"
      >
        {isSubmitting ? "Salvando..." : "Salvar Perfil"}
      </button>
    </form>
  );
}
