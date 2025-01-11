import type {RouteRecordRaw} from "vue-router";
import type {MenuItemType} from "ant-design-vue/es/menu/src/interface";

export function routeToMenuItems(routes: RouteRecordRaw[]): MenuItemType[] {
    return routes.map(route => {
        return {
            key: route.name as string,
            title: route.meta?.title as string,
            label: route.meta?.title as string,
            children: route.children ? routeToMenuItems(route.children as RouteRecordRaw[]) : null,
        }
    })
}
