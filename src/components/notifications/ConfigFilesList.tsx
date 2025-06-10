'use client';

import { FileText, Smartphone, Settings, Book, Code, Globe, Folder, FolderOpen, Database, Cog } from 'lucide-react';
interface ConfigFile {
  name: string;
  path: string;
  description: string;
  icon: React.ReactNode;
  type: 'main' | 'component' | 'documentation' | 'bridge' | 'configuration' | 'folder';
  status: 'active' | 'created' | 'configured';
}
interface FolderStructure {
  name: string;
  path: string;
  description: string;
  files: ConfigFile[];
}
export default function ConfigFilesList() {
  const folderStructure: FolderStructure[] = [{
    name: 'src/app/notif-android/',
    path: 'src/app/notif-android/',
    description: 'Root folder untuk halaman dashboard OneSignal Android',
    files: [{
      name: 'page.tsx',
      path: 'src/app/notif-android/page.tsx',
      description: 'Halaman utama dashboard OneSignal untuk mengirim push notification ke Android',
      icon: <Smartphone className="h-4 w-4" />,
      type: 'main',
      status: 'active'
    }]
  }, {
    name: 'src/components/notifications/',
    path: 'src/components/notifications/',
    description: 'Folder komponen untuk fitur notifikasi OneSignal',
    files: [{
      name: 'ConfigFilesList.tsx',
      path: 'src/components/notifications/ConfigFilesList.tsx',
      description: 'Komponen untuk menampilkan daftar file konfigurasi OneSignal',
      icon: <FileText className="h-4 w-4" />,
      type: 'component',
      status: 'active'
    }, {
      name: 'SetupInstructions.tsx',
      path: 'src/components/notifications/SetupInstructions.tsx',
      description: 'Komponen instruksi setup OneSignal yang interaktif',
      icon: <Book className="h-4 w-4" />,
      type: 'component',
      status: 'created'
    }]
  }, {
    name: 'src/components/layout/',
    path: 'src/components/layout/',
    description: 'Folder layout components dengan konfigurasi menu OneSignal',
    files: [{
      name: 'Sidebar.tsx',
      path: 'src/components/layout/Sidebar.tsx',
      description: 'Konfigurasi menu navigasi untuk halaman NOTIF-ANDROID',
      icon: <Settings className="h-4 w-4" />,
      type: 'configuration',
      status: 'configured'
    }]
  }, {
    name: 'src/lib/',
    path: 'src/lib/',
    description: 'Folder library untuk OneSignal bridge dan utilities',
    files: [{
      name: 'kodular-onesignal-bridge.js',
      path: 'src/lib/kodular-onesignal-bridge.js',
      description: 'JavaScript bridge untuk komunikasi antara web app dan Kodular Android',
      icon: <Code className="h-4 w-4" />,
      type: 'bridge',
      status: 'created'
    }]
  }, {
    name: 'src/docs/',
    path: 'src/docs/',
    description: 'Folder dokumentasi untuk setup OneSignal',
    files: [{
      name: 'kodular-onesignal-setup-guide.md',
      path: 'src/docs/kodular-onesignal-setup-guide.md',
      description: 'Panduan lengkap setup OneSignal di Kodular tanpa ekstensi & FCM',
      icon: <Book className="h-4 w-4" />,
      type: 'documentation',
      status: 'created'
    }]
  }, {
    name: 'public/',
    path: 'public/',
    description: 'Folder publik untuk script OneSignal yang dapat diakses WebView',
    files: [{
      name: 'kodular-onesignal-bridge.js',
      path: 'public/kodular-onesignal-bridge.js',
      description: 'Copy dari bridge file untuk akses publik oleh WebView',
      icon: <Globe className="h-4 w-4" />,
      type: 'bridge',
      status: 'created'
    }]
  }];
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'main':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'component':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'documentation':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'bridge':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'configuration':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'folder':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'configured':
        return 'bg-blue-100 text-blue-800';
      case 'created':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'main':
        return 'Halaman Utama';
      case 'component':
        return 'Komponen React';
      case 'documentation':
        return 'Dokumentasi';
      case 'bridge':
        return 'Bridge Script';
      case 'configuration':
        return 'Konfigurasi';
      case 'folder':
        return 'Folder';
      default:
        return 'Lainnya';
    }
  };
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Aktif';
      case 'configured':
        return 'Terkonfigurasi';
      case 'created':
        return 'Dibuat';
      default:
        return 'Unknown';
    }
  };
  return <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6" data-unique-id="c9870b93-283c-4e45-b17c-c32f57493c28" data-file-name="components/notifications/ConfigFilesList.tsx" data-dynamic-text="true">
      <div className="mb-6" data-unique-id="25d721c4-fa4f-4e90-929f-3b3577b5315b" data-file-name="components/notifications/ConfigFilesList.tsx">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-3" data-unique-id="a2ddd9df-0f9c-427a-b17a-7159bcd8de61" data-file-name="components/notifications/ConfigFilesList.tsx">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg" data-unique-id="5246778d-34dd-4975-9576-32feda0c7708" data-file-name="components/notifications/ConfigFilesList.tsx">
            <Database className="h-6 w-6 text-white" />
          </div>
          <span data-unique-id="ac22e7be-4d58-46c6-8f53-2acff6d405cd" data-file-name="components/notifications/ConfigFilesList.tsx"><span className="editable-text" data-unique-id="2d6cae9d-a643-40cb-aab6-886eccc613e1" data-file-name="components/notifications/ConfigFilesList.tsx">File & Folder Konfigurasi OneSignal Push Notification</span></span>
        </h2>
        <p className="text-gray-600" data-unique-id="9dde8763-6e89-487a-a46f-abfb125c08ea" data-file-name="components/notifications/ConfigFilesList.tsx"><span className="editable-text" data-unique-id="049268a7-4ff7-4525-ba60-ffb0c298e63e" data-file-name="components/notifications/ConfigFilesList.tsx">
          Struktur lengkap semua file dan folder yang telah dibuat untuk fitur push notification melalui dashboard OneSignal
        </span></p>
      </div>

      {/* Folder Structure */}
      <div className="space-y-6" data-unique-id="f5aa6b89-27e7-4c70-b0f4-731ab91b2888" data-file-name="components/notifications/ConfigFilesList.tsx" data-dynamic-text="true">
        {folderStructure.map((folder, folderIndex) => <div key={folderIndex} className="border border-gray-200 rounded-lg overflow-hidden" data-unique-id="2ccc32d6-4947-422b-a7bc-bc56271a4cdc" data-file-name="components/notifications/ConfigFilesList.tsx" data-dynamic-text="true">
            {/* Folder Header */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 border-b border-gray-200" data-unique-id="e0b3f210-6a12-490a-9d08-45e0b3d6bc39" data-file-name="components/notifications/ConfigFilesList.tsx">
              <div className="flex items-start gap-3" data-unique-id="b54be3e1-19f3-4099-aac0-d9bac175964c" data-file-name="components/notifications/ConfigFilesList.tsx">
                <div className="p-2 bg-white rounded-lg shadow-sm" data-unique-id="fd7b514b-283a-4dfc-8dfb-78f1099920d4" data-file-name="components/notifications/ConfigFilesList.tsx">
                  <FolderOpen className="h-5 w-5 text-amber-600" data-unique-id="7250b96c-740d-40fd-bb9f-08dbb4c27d84" data-file-name="components/notifications/ConfigFilesList.tsx" data-dynamic-text="true" />
                </div>
                <div className="flex-1" data-unique-id="c0f2e89a-8c81-493e-83db-7117a7fa6272" data-file-name="components/notifications/ConfigFilesList.tsx">
                  <h3 className="font-bold text-gray-800 text-lg" data-unique-id="d501a2c9-273d-4859-aa7b-0e2b6f09939b" data-file-name="components/notifications/ConfigFilesList.tsx" data-dynamic-text="true">{folder.name}</h3>
                  <p className="text-gray-600 text-sm mt-1" data-unique-id="b7ea3bd3-8e7b-43da-8f91-cd5b0bc8ad26" data-file-name="components/notifications/ConfigFilesList.tsx" data-dynamic-text="true">{folder.description}</p>
                  <div className="flex items-center gap-2 mt-2" data-unique-id="25f3b4a5-0c55-4c12-a111-46c10bbab738" data-file-name="components/notifications/ConfigFilesList.tsx">
                    <span className="text-xs text-gray-500" data-unique-id="91456a99-50b1-4497-850c-a82542ef444b" data-file-name="components/notifications/ConfigFilesList.tsx"><span className="editable-text" data-unique-id="3cfdd7b6-b2b3-4454-b240-227a63970461" data-file-name="components/notifications/ConfigFilesList.tsx">Path:</span></span>
                    <code className="text-xs bg-white px-2 py-1 rounded border font-mono text-gray-700" data-unique-id="4b74adf3-1f79-4c96-9d0f-86854e4ed448" data-file-name="components/notifications/ConfigFilesList.tsx" data-dynamic-text="true">
                      {folder.path}
                    </code>
                  </div>
                </div>
              </div>
            </div>

            {/* Files in Folder */}
            <div className="divide-y divide-gray-100" data-unique-id="dc36b626-5f7d-4512-ba90-638e6503d8c1" data-file-name="components/notifications/ConfigFilesList.tsx" data-dynamic-text="true">
              {folder.files.map((file, fileIndex) => <div key={fileIndex} className="p-4 hover:bg-gray-50 transition-colors duration-200" data-unique-id="aaf282ad-4c3d-46c5-bacd-441e87d45351" data-file-name="components/notifications/ConfigFilesList.tsx">
                  <div className="flex items-start gap-3" data-unique-id="12e0c9b8-aa5f-43bc-9609-f4ca4d324ecf" data-file-name="components/notifications/ConfigFilesList.tsx">
                    <div className="p-2 bg-gray-100 rounded-lg flex-shrink-0" data-unique-id="50f76b93-afa4-4877-b4fb-2a2e6f571c3c" data-file-name="components/notifications/ConfigFilesList.tsx" data-dynamic-text="true">
                      {file.icon}
                    </div>
                    
                    <div className="flex-1" data-unique-id="c2be5cb6-1acb-4ed6-a7a2-4b20bd41df0d" data-file-name="components/notifications/ConfigFilesList.tsx">
                      <div className="flex items-center gap-2 mb-2 flex-wrap" data-unique-id="a1e265d7-0d5c-4aea-bca4-eb084f7f36fa" data-file-name="components/notifications/ConfigFilesList.tsx">
                        <h4 className="font-semibold text-gray-800" data-unique-id="1d315334-8c3c-4c6f-8449-ed72f0340d5f" data-file-name="components/notifications/ConfigFilesList.tsx" data-dynamic-text="true">{file.name}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getTypeColor(file.type)}`} data-unique-id="69da21d6-a7e4-43ec-a8dc-b0caf74e5d7d" data-file-name="components/notifications/ConfigFilesList.tsx" data-dynamic-text="true">
                          {getTypeLabel(file.type)}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(file.status)}`} data-unique-id="b074c36c-a841-4c3e-9b11-48bee60d224d" data-file-name="components/notifications/ConfigFilesList.tsx" data-dynamic-text="true">
                          {getStatusLabel(file.status)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mb-2" data-unique-id="5c740701-8ca8-4121-a5d4-70fd62aa8d86" data-file-name="components/notifications/ConfigFilesList.tsx" data-dynamic-text="true">{file.description}</p>
                      
                      <div className="flex items-center gap-2" data-unique-id="74485295-6e77-4a58-9722-c28e81af99ea" data-file-name="components/notifications/ConfigFilesList.tsx">
                        <span className="text-xs text-gray-500" data-unique-id="f487e46c-6f40-43c8-8ddf-1fefe8c31b7c" data-file-name="components/notifications/ConfigFilesList.tsx"><span className="editable-text" data-unique-id="96c7b7fc-6ee2-441d-aafe-d745ade97641" data-file-name="components/notifications/ConfigFilesList.tsx">Full Path:</span></span>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono text-gray-700" data-unique-id="dbcef4ab-63e1-407c-b1a4-3b6146e01fcd" data-file-name="components/notifications/ConfigFilesList.tsx" data-dynamic-text="true">
                          {file.path}
                        </code>
                      </div>
                    </div>
                  </div>
                </div>)}
            </div>
          </div>)}
      </div>

      {/* Configuration Summary */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6" data-unique-id="22487f98-3a0a-4436-803e-73baed23c3ea" data-file-name="components/notifications/ConfigFilesList.tsx" data-dynamic-text="true">
        {/* OneSignal Info */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6" data-unique-id="a3776854-ee9f-41d0-9970-7044ce969ea9" data-file-name="components/notifications/ConfigFilesList.tsx">
          <h3 className="font-bold text-blue-800 mb-4 flex items-center gap-2" data-unique-id="42086f9c-945c-4782-aa2d-94ee9fb217d5" data-file-name="components/notifications/ConfigFilesList.tsx">
            <Cog className="h-5 w-5" />
            <span data-unique-id="c850463c-1247-47be-9be4-f9791d5ae48d" data-file-name="components/notifications/ConfigFilesList.tsx"><span className="editable-text" data-unique-id="0e934c80-8a5a-4eda-95e2-31ea1622a718" data-file-name="components/notifications/ConfigFilesList.tsx">Konfigurasi OneSignal</span></span>
          </h3>
          
          <div className="space-y-3" data-unique-id="66f6809e-3273-4919-9762-aa84a1d2296c" data-file-name="components/notifications/ConfigFilesList.tsx">
            <div data-unique-id="3e66ee73-36a6-46d3-86fd-c7819a81f804" data-file-name="components/notifications/ConfigFilesList.tsx">
              <span className="text-sm font-medium text-blue-700" data-unique-id="7fa256f7-92f3-4f42-a2ba-b758ab9336b6" data-file-name="components/notifications/ConfigFilesList.tsx"><span className="editable-text" data-unique-id="2ec536f7-72df-43e3-8c49-54403d9173ba" data-file-name="components/notifications/ConfigFilesList.tsx">App ID:</span></span>
              <div className="bg-white p-3 rounded-lg border border-blue-200 mt-1" data-unique-id="624a2f25-358e-46fd-a2dd-f89029aeb1a3" data-file-name="components/notifications/ConfigFilesList.tsx">
                <code className="text-sm font-mono text-blue-800 break-all" data-unique-id="b72d5413-24ab-4883-b8ff-d54abdb145ab" data-file-name="components/notifications/ConfigFilesList.tsx"><span className="editable-text" data-unique-id="c11b36e3-85a9-4f87-ab94-b1e446022399" data-file-name="components/notifications/ConfigFilesList.tsx">
                  c8ac779e-241b-4903-8ed4-6766936a4fee
                </span></code>
              </div>
            </div>
            
            <div className="flex items-center gap-2 bg-green-100 p-3 rounded-lg border border-green-200" data-unique-id="dcdb502b-ccbf-4ee7-9d7a-cdf75dd2732a" data-file-name="components/notifications/ConfigFilesList.tsx">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" data-unique-id="8ea77c98-35a9-4e7a-878f-517ce02350fa" data-file-name="components/notifications/ConfigFilesList.tsx"></div>
              <span className="text-sm text-green-700 font-medium" data-unique-id="d14b1754-b7c9-489d-95f4-211395d2d94c" data-file-name="components/notifications/ConfigFilesList.tsx"><span className="editable-text" data-unique-id="25edb668-17c7-4719-94e3-d2c2a063fede" data-file-name="components/notifications/ConfigFilesList.tsx">Terhubung & Aktif</span></span>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200 p-6" data-unique-id="3933d310-696e-4ebf-b38e-3c5ddf75ffdb" data-file-name="components/notifications/ConfigFilesList.tsx">
          <h3 className="font-bold text-purple-800 mb-4 flex items-center gap-2" data-unique-id="a1bd5c98-7e95-479d-9e02-97156031934a" data-file-name="components/notifications/ConfigFilesList.tsx">
            <FileText className="h-5 w-5" />
            <span data-unique-id="0fb485a6-c50c-46f3-959b-cf70b47c982a" data-file-name="components/notifications/ConfigFilesList.tsx"><span className="editable-text" data-unique-id="1f5e5cad-a45d-4777-a549-69dcdbd3aae5" data-file-name="components/notifications/ConfigFilesList.tsx">Statistik File</span></span>
          </h3>
          
          <div className="space-y-3" data-unique-id="0001843b-f2a3-4d74-8164-3624d3e136d6" data-file-name="components/notifications/ConfigFilesList.tsx">
            <div className="flex justify-between items-center" data-unique-id="f43614fd-f5a0-487a-b60c-47fd14e75289" data-file-name="components/notifications/ConfigFilesList.tsx">
              <span className="text-sm text-purple-700" data-unique-id="8e1a39f4-71a6-48e0-9cfc-8e57071c073c" data-file-name="components/notifications/ConfigFilesList.tsx"><span className="editable-text" data-unique-id="891c8c86-9cc8-4d05-b9f5-9ea57d2d9fe1" data-file-name="components/notifications/ConfigFilesList.tsx">Total Folder:</span></span>
              <span className="font-bold text-purple-800" data-unique-id="f7480626-76b5-462f-a643-2c2decb8ddb3" data-file-name="components/notifications/ConfigFilesList.tsx" data-dynamic-text="true">{folderStructure.length}</span>
            </div>
            <div className="flex justify-between items-center" data-unique-id="11335315-3431-463b-a41a-20a5cff0b9ad" data-file-name="components/notifications/ConfigFilesList.tsx">
              <span className="text-sm text-purple-700" data-unique-id="83cb4877-27be-4415-bc6b-702a8e84e97c" data-file-name="components/notifications/ConfigFilesList.tsx"><span className="editable-text" data-unique-id="8a7eff5e-4bb4-4f5e-99de-b21acb59d1c3" data-file-name="components/notifications/ConfigFilesList.tsx">Total File:</span></span>
              <span className="font-bold text-purple-800" data-unique-id="04bdb5ab-78c2-4c93-a503-e89f04f31875" data-file-name="components/notifications/ConfigFilesList.tsx" data-dynamic-text="true">
                {folderStructure.reduce((total, folder) => total + folder.files.length, 0)}
              </span>
            </div>
            <div className="flex justify-between items-center" data-unique-id="3ff6de55-e46e-4979-bc02-2bd84b08f679" data-file-name="components/notifications/ConfigFilesList.tsx">
              <span className="text-sm text-purple-700" data-unique-id="5dc9519b-d225-455c-aa86-1e9f275c1302" data-file-name="components/notifications/ConfigFilesList.tsx"><span className="editable-text" data-unique-id="2322aa04-20ef-4683-8350-36d9348b137c" data-file-name="components/notifications/ConfigFilesList.tsx">File Aktif:</span></span>
              <span className="font-bold text-green-600" data-unique-id="c0eeeb39-657a-4fb1-afd1-edbe427aee65" data-file-name="components/notifications/ConfigFilesList.tsx" data-dynamic-text="true">
                {folderStructure.reduce((total, folder) => total + folder.files.filter(file => file.status === 'active').length, 0)}
              </span>
            </div>
            <div className="flex justify-between items-center" data-unique-id="1ac012ab-c4d1-4745-8749-8d85d3a1ce9c" data-file-name="components/notifications/ConfigFilesList.tsx">
              <span className="text-sm text-purple-700" data-unique-id="59035e6b-2ec6-4d63-9961-44c33190835f" data-file-name="components/notifications/ConfigFilesList.tsx"><span className="editable-text" data-unique-id="0150f2c0-3eb0-4b0b-8b1a-779b906b42f6" data-file-name="components/notifications/ConfigFilesList.tsx">File Terkonfigurasi:</span></span>
              <span className="font-bold text-blue-600" data-unique-id="7e00ea6b-b868-42d8-812d-b99f42b097a9" data-file-name="components/notifications/ConfigFilesList.tsx" data-dynamic-text="true">
                {folderStructure.reduce((total, folder) => total + folder.files.filter(file => file.status === 'configured').length, 0)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Implementation Notes */}
      <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200" data-unique-id="10acfe98-31cd-4391-b01e-6d860954ec75" data-file-name="components/notifications/ConfigFilesList.tsx">
        <h3 className="font-bold text-amber-800 mb-2 flex items-center gap-2" data-unique-id="39e5a847-dbe7-49e7-bda9-ac258e689f57" data-file-name="components/notifications/ConfigFilesList.tsx">
          <Book className="h-5 w-5" />
          <span data-unique-id="bb1c93fa-5455-4336-ad43-dd8cd1d73ad8" data-file-name="components/notifications/ConfigFilesList.tsx"><span className="editable-text" data-unique-id="7c67d22d-77d4-447e-aaa9-466c19559d7d" data-file-name="components/notifications/ConfigFilesList.tsx">Catatan Implementasi</span></span>
        </h3>
        <div className="space-y-2 text-sm text-amber-700" data-unique-id="771588d8-184d-455a-9fd1-6397e7450098" data-file-name="components/notifications/ConfigFilesList.tsx">
          <p data-unique-id="aaef9aef-0532-4a36-a82d-b845361ae6db" data-file-name="components/notifications/ConfigFilesList.tsx"><span className="editable-text" data-unique-id="b5a6bcf2-7037-4949-b915-3ac0dcd82055" data-file-name="components/notifications/ConfigFilesList.tsx">• Semua file telah dikonfigurasi untuk bekerja tanpa ekstensi OneSignal deprecated</span></p>
          <p data-unique-id="e1c06a9e-388b-4f0f-9ceb-921110ad8795" data-file-name="components/notifications/ConfigFilesList.tsx"><span className="editable-text" data-unique-id="c301ac13-f939-4c03-8e14-348ed34b2c54" data-file-name="components/notifications/ConfigFilesList.tsx">• Bridge script tersedia di folder lib dan public untuk akses WebView</span></p>
          <p data-unique-id="bb61ae97-7e09-4048-bf05-4ae0a942b289" data-file-name="components/notifications/ConfigFilesList.tsx"><span className="editable-text" data-unique-id="7133facc-25b3-4b89-bcc7-1e65d05e3634" data-file-name="components/notifications/ConfigFilesList.tsx">• Dokumentasi lengkap tersedia untuk setup Kodular</span></p>
          <p data-unique-id="af1c8820-8866-4458-9afe-2ecdb49afc6b" data-file-name="components/notifications/ConfigFilesList.tsx"><span className="editable-text" data-unique-id="dcd05420-03b3-40df-af8a-c9a916e9cdcf" data-file-name="components/notifications/ConfigFilesList.tsx">• Komponen UI telah terintegrasi dengan sistem navigasi</span></p>
          <p data-unique-id="a031978e-215f-4f00-be79-bd4fc7c4d396" data-file-name="components/notifications/ConfigFilesList.tsx"><span className="editable-text" data-unique-id="22bb0fcb-5665-42ba-be4b-048364431075" data-file-name="components/notifications/ConfigFilesList.tsx">• Konfigurasi OneSignal menggunakan REST API terbaru</span></p>
        </div>
      </div>
    </div>;
}