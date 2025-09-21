import { useState, useEffect } from "react";
import { User, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Navigation from "./Navigation";

interface UserProfileProps {
  onClose?: () => void;
}

export default function UserProfile({ onClose }: UserProfileProps) {
  const [userEmail, setUserEmail] = useState("");
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });
  const [isUserEditDialogOpen, setIsUserEditDialogOpen] = useState(false);
  const [editingUserInfo, setEditingUserInfo] = useState(userInfo);

  useEffect(() => {
    // Load user data from localStorage
    const email = localStorage.getItem("userEmail");
    if (email) {
      setUserEmail(email);
      
      // Update user info from localStorage
      setUserInfo({
        name: localStorage.getItem("userName") || "",
        email: email,
        phone: localStorage.getItem("userPhone") || "",
        address: localStorage.getItem("userAddress") || ""
      });
    }
  }, []);

  if (!userEmail) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-accent/20 py-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="font-heading font-bold text-4xl text-foreground mb-4">
            Your Profile
          </h1>
          <p className="font-body text-xl text-muted-foreground mb-8">
            Please sign in to view your profile.
          </p>
          <Button 
            onClick={() => window.location.href = '/'} 
            className="hover-elevate"
          >
            Back to Home
          </Button>
        </div>
      </div>
    );
  }
  
  const handleEditUserInfo = () => {
    setEditingUserInfo({...userInfo});
    setIsUserEditDialogOpen(true);
  };
  
  const handleSaveUserInfo = () => {
    const updatedUserInfo = {
      name: editingUserInfo.name.trim() || "",
      phone: editingUserInfo.phone.trim() || "",
      address: editingUserInfo.address.trim() || ""
    };
    
    setUserInfo({...userInfo, ...updatedUserInfo});
    localStorage.setItem("userName", updatedUserInfo.name);
    localStorage.setItem("userPhone", updatedUserInfo.phone);
    localStorage.setItem("userAddress", updatedUserInfo.address);
    setIsUserEditDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/20">
      <Navigation />
      
      <div className="pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="font-heading font-bold text-4xl text-foreground mb-4">
              Your Profile
            </h1>
            <p className="font-body text-xl text-muted-foreground">
              Manage your personal information
            </p>
          </div>

          {/* User Profile Information */}
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <User className="w-10 h-10 text-primary" />
              </div>
              <CardTitle className="text-2xl font-heading">
                Profile Information
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Name</Label>
                    <p className="text-lg font-medium mt-1">
                      {userInfo.name || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                    <p className="text-lg font-medium mt-1">{userInfo.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                    <p className="text-lg font-medium mt-1">
                      {userInfo.phone || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-muted-foreground">Address</Label>
                    <p className="text-lg font-medium mt-1">
                      {userInfo.address || "Not provided"}
                    </p>
                  </div>
                </div>
                
                <div className="pt-6 border-t">
                  <Button 
                    onClick={handleEditUserInfo}
                    className="w-full md:w-auto hover-elevate"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Profile Information
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Edit User Info Dialog */}
      <Dialog open={isUserEditDialogOpen} onOpenChange={setIsUserEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile Information</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={editingUserInfo.name}
                onChange={(e) => setEditingUserInfo({
                  ...editingUserInfo,
                  name: e.target.value
                })}
                placeholder="Your full name"
              />
            </div>
            
            <div>
              <Label htmlFor="edit-phone">Phone</Label>
              <Input
                id="edit-phone"
                value={editingUserInfo.phone}
                onChange={(e) => setEditingUserInfo({
                  ...editingUserInfo,
                  phone: e.target.value
                })}
                placeholder="Your phone number"
              />
            </div>
            
            <div>
              <Label htmlFor="edit-address">Address</Label>
              <Input
                id="edit-address"
                value={editingUserInfo.address}
                onChange={(e) => setEditingUserInfo({
                  ...editingUserInfo,
                  address: e.target.value
                })}
                placeholder="Your address"
              />
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button
              onClick={handleSaveUserInfo}
              className="flex-1 hover-elevate"
            >
              Save Changes
            </Button>
            <Button
              onClick={() => setIsUserEditDialogOpen(false)}
              variant="outline"
              className="flex-1 hover-elevate"
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}