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
import { toast } from "sonner";

export default function UserProfileForm() {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<z.infer<typeof userProfileSchema>>({
    resolver: zodResolver(userProfileSchema),
  });

  const [preview, setPreview] = useState<string | null>(null);
  const imageFile = watch("storeImage");
  const zipCode = watch("zipCode");
  const router = useRouter();

  // 🔎 Busca dados do CEP ao preencher
  useEffect(() => {
    const fetchAddressByCep = async () => {
      if (zipCode && zipCode.length >= 8) {
        try {
          const res = await fetch(`https://viacep.com.br/ws/${zipCode}/json/`);
          const data = await res.json();
          if (!data.erro) {
            setValue("street", data.logradouro || "");
            setValue("neighborhood", data.bairro || "");
            setValue("city", data.localidade || "");
            setValue("state", data.uf || "");
          }
        } catch (error) {
          console.error("Erro ao buscar CEP", error);
        }
      }
    };
    fetchAddressByCep();
  }, [zipCode, setValue]);

  const onSubmit = async (data: UserProfileFormData) => {
    console.log("ENTROU NA FUNÇÃO");
    try {
      // Monta string completa do endereço
      const address = `${data.street}, ${data.number}${
        data.complement ? " - " + data.complement : ""
      } - ${data.neighborhood}, ${data.city} - ${data.state}, ${data.zipCode}`;

      // Upload da imagem
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

      // Envia dados para o backend
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: data.companyName,
          email: data.email,
          password: data.password,
          cnpj: data.cnpj,
          address,
          contact: data.contact,
          representativeName: data.representativeName,
          storeImageUrl: imageUrl,
        }),
      });

      if (!response.ok) throw new Error("Erro ao salvar usuário");

      toast.success("Cadastro efetuado com sucesso!", {
        style: {
          background: "#22c55e",
          color: "#fff",
        },
      });
      router.push("/auth/sign-in");
    } catch (error) {
      toast.error("Erro ao cadastrar usuário");
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
        <p className="text-center font-bold">Dados da empresa:</p>
        <div>
          <label className="block font-medium">Nome da empresa</label>
          <input
            type="text"
            {...register("companyName")}
            className="w-full border p-2 rounded"
          />
          {errors.companyName && (
            <p className="text-red-500 text-sm">{errors.companyName.message}</p>
          )}
        </div>
        <div>
          <label className="block font-medium">Nome do Representante</label>
          <input
            type="text"
            {...register("representativeName")}
            className="w-full border p-2 rounded"
          />
          {errors.representativeName && (
            <p className="text-red-500 text-sm">
              {errors.representativeName.message}
            </p>
          )}
        </div>
        <div>
          <label className="block font-medium">E-mail</label>
          <input
            type="email"
            {...register("email")}
            className="w-full border p-2 rounded"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}
        </div>
        <div>
          <label className="block font-medium">Senha</label>
          <input
            type="password"
            {...register("password")}
            className="w-full border p-2 rounded"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}
        </div>
        <div>
          <label className="block font-medium">CNPJ</label>
          <input
            type="text"
            {...register("cnpj")}
            className="w-full border p-2 rounded"
          />
          {errors.cnpj && (
            <p className="text-red-500 text-sm">{errors.cnpj.message}</p>
          )}
        </div>
        <div>
          <label className="block font-medium">
            Contato (telefone ou WhatsApp)
          </label>
          <input
            type="text"
            {...register("contact")}
            className="w-full border p-2 rounded"
          />
          {errors.contact && (
            <p className="text-red-500 text-sm">{errors.contact.message}</p>
          )}
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
              <p className="text-sm text-zinc-500">
                Clique para selecionar uma imagem
              </p>
              <p className="text-xs text-zinc-400">JPG, PNG ou WEBP até 5MB</p>
            </div>
          </div>
          {errors.storeImage && (
            <p className="text-red-500 text-sm">
              {errors.storeImage.message as string}
            </p>
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
              <img
                src={preview}
                alt="Pré-visualização"
                className="mt-2 rounded-lg border object-cover w-full h-40"
              />
            </div>
          )}
        </div>
      </div>

      <div>
        <p className="font-bold mb-3 text-center">Endereço:</p>
        <div>
          <label className="block font-medium">CEP</label>
          <input
            type="text"
            {...register("zipCode")}
            className="w-full border p-2 rounded"
          />
          {errors.zipCode && (
            <p className="text-red-500 text-sm">{errors.zipCode.message}</p>
          )}
        </div>
        <div>
          <label className="block font-medium">Rua</label>
          <input
            type="text"
            {...register("street")}
            className="w-full border p-2 rounded"
          />
          {errors.street && (
            <p className="text-red-500 text-sm">{errors.street.message}</p>
          )}
        </div>
        <div>
          <label className="block font-medium">Número</label>
          <input
            type="number"
            {...register("number")}
            className="w-full border p-2 rounded"
          />
          {errors.number && (
            <p className="text-red-500 text-sm">{errors.number.message}</p>
          )}
        </div>
        <div>
          <label className="block font-medium">Complemento</label>
          <input
            type="text"
            {...register("complement")}
            className="w-full border p-2 rounded"
          />
        </div>
        <div>
          <label className="block font-medium">Bairro</label>
          <input
            type="text"
            {...register("neighborhood")}
            className="w-full border p-2 rounded"
          />
          {errors.neighborhood && (
            <p className="text-red-500 text-sm">
              {errors.neighborhood.message}
            </p>
          )}
        </div>
        <div>
          <label className="block font-medium">Cidade</label>
          <input
            type="text"
            {...register("city")}
            className="w-full border p-2 rounded"
          />
          {errors.city && (
            <p className="text-red-500 text-sm">{errors.city.message}</p>
          )}
        </div>
        <div>
          <label className="block font-medium">Estado</label>
          <input
            type="text"
            {...register("state")}
            className="w-full border p-2 rounded"
          />
          {errors.state && (
            <p className="text-red-500 text-sm">{errors.state.message}</p>
          )}
        </div>
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
