import { Button } from "@/components/button";
import { Header } from "@/components/header";
import { Input } from "@/components/input";
import { LinkButton } from "@/components/link-button";
import { Product } from "@/components/product";
import { ProductCartProps, useCartStore } from "@/stores/cart-stores";
import { formatCurrency } from "@/utils/functions/format-currency";
import { Feather } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useState } from "react";
import { Alert, Linking, ScrollView, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const PHONE_NUMBER = "5532984159697";

export default function Cart() {
  const [address, setAddress] = useState("");
  const cartStore = useCartStore();
  const navigation = useNavigation();

  const total = formatCurrency(
    cartStore.products.reduce((total, product) => {
      return total + product.price * product.quantity;
    }, 0)
  );

  function handleProductRemove(product: ProductCartProps) {
    Alert.alert(
      "Remover produto",
      `Deseja remover ${product.title} do carrinho?`,
      [
        { text: "Cancelar" },
        {
          text: "Remover",
          onPress: () => cartStore.remove(product.id),
        },
      ]
    );
  }

  function handleOrder() {
    if (address.trim().length === 0) {
      return Alert.alert("Pedido", "Informe o endereço de entrega");
    }

    const products = cartStore.products
      .map((product) => `\n ${product.quantity} x ${product.title}`)
      .join("");

    const message = `
      Novo pedido! 🍔
      \n Entregar em: ${address}

      ${products}

      \n Valor total: ${total}
    `;

    Linking.openURL(
      `http://api.whatsapp.com/send?phone=${PHONE_NUMBER}&text=${message}`
    );

    cartStore.clear();

    navigation.goBack();

    Alert.alert("Pedido", "Seu pedido foi enviado com sucesso!");
  }

  return (
    <View className="flex-1 pt-8">
      <Header title="Seu carrinho" />

      <KeyboardAwareScrollView>
        <ScrollView>
          <View className="p-5 flex-1">
            {cartStore.products.length > 0 ? (
              <View className="border-b border-slate-700">
                {cartStore.products.map((product) => (
                  <Product
                    key={product.id}
                    data={product}
                    onPress={() => handleProductRemove(product)}
                  />
                ))}
              </View>
            ) : (
              <Text className="text-slate-400 font-body text-center my-8">
                Seu carrinho esta vazio
              </Text>
            )}

            <View className="flex-row gap-2 items-center mt-5 mb-4">
              <Text className="text-white text-xl font-subtitle">Total:</Text>

              <Text className="text-lime-400 text-2xl font-heading">
                {total}
              </Text>
            </View>

            <Input
              placeholder="Informe o endereço de entrega com rua, bairro, CEP, número e complemento..."
              onChangeText={setAddress}
              onSubmitEditing={handleOrder}
              blurOnSubmit={true}
              returnKeyType="next"
            />
          </View>
        </ScrollView>
      </KeyboardAwareScrollView>

      <View className="p-5 gap-5">
        <Button onPress={handleOrder}>
          <Button.Text>Enviar pedido</Button.Text>
          <Button.Icon>
            <Feather name="arrow-right-circle" size={20} />
          </Button.Icon>
        </Button>

        <LinkButton title="Voltar ao cardápio" href="/" />
      </View>
    </View>
  );
}
