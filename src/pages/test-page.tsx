import { ThemeSelect } from "@/components/theme/theme-selector";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemHeader,
  ItemMedia,
} from "@/components/ui/item";
import { FiUser } from "react-icons/fi";

/** Песочница UI: маршрут `/test` */
export function Test() {
  return (
    <div className="mx-auto mb-20 flex max-w-150 flex-col gap-4 px-4 py-8">
      <h1 className="text-2xl font-bold">Hello world!</h1>
      <p>ВещьВокруг</p>
      <Card>
        <CardHeader>
          <CardTitle>Всем привет</CardTitle>
        </CardHeader>
        <CardContent>
          Подробности
          <CardDescription>Описание</CardDescription>
        </CardContent>
      </Card>
      <Button>Кнопка</Button>
      <Input placeholder="Поле ввода"></Input>
      <Item className="flex flex-col items-center bg-blue-300 text-center dark:bg-blue-600">
        <ItemHeader>
          <ItemMedia variant="image">
            <FiUser />
          </ItemMedia>
        </ItemHeader>
        <ItemContent>
          Контент
          <ItemDescription>Описание</ItemDescription>
        </ItemContent>
        <ItemFooter>
          <ItemActions>
            <Button>Action</Button>
          </ItemActions>
        </ItemFooter>
      </Item>
      <ThemeSelect />
    </div>
  );
}
