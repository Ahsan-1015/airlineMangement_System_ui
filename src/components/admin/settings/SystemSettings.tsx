import { motion } from "motion/react";
import { Button } from "../../ui/button";
import { Card } from "../../ui/card";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../ui/select";

export function SystemSettings() {
  return (
    <motion.div
      key="settings"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="mb-6">
        <h2 className="text-gray-900 mb-2">System Settings</h2>
        <p className="text-gray-500">
          Configure system preferences and settings
        </p>
      </div>

      <div className="space-y-6">
        <Card className="p-6 rounded-2xl border-0 bg-white">
          <h3 className="text-gray-900 mb-4">General Settings</h3>
          <div className="space-y-4">
            <div>
              <Label>System Name</Label>
              <Input
                defaultValue="SkyWings Airlines"
                className="mt-2 rounded-xl"
              />
            </div>
            <div>
              <Label>Admin Email</Label>
              <Input
                defaultValue="admin@skywings.com"
                className="mt-2 rounded-xl"
              />
            </div>
            <div>
              <Label>Time Zone</Label>
              <Select defaultValue="utc">
                <SelectTrigger className="mt-2 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="utc">UTC (GMT+0)</SelectItem>
                  <SelectItem value="est">EST (GMT-5)</SelectItem>
                  <SelectItem value="pst">PST (GMT-8)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        <Card className="p-6 rounded-2xl border-0 bg-white">
          <h3 className="text-gray-900 mb-4">Notification Settings</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-900">Email Notifications</div>
                <p className="text-sm text-gray-500">
                  Receive email alerts for important events
                </p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-gray-900">Flight Alerts</div>
                <p className="text-sm text-gray-500">
                  Get notified about flight status changes
                </p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>
          </div>
        </Card>

        <Button className="bg-gradient-to-r from-orange-500 via-red-500 to-amber-500 hover:from-orange-600 hover:via-red-600 hover:to-amber-600 text-white rounded-xl">
          Save Settings
        </Button>
      </div>
    </motion.div>
  );
}
