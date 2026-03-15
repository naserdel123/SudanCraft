import { world, system } from "@minecraft/server";

console.log("§6[SudanCraft] §rتم تحميل مود السودان!");

// ==================== أحداث السودان ====================

// عند دخول اللاعب
world.afterEvents.playerSpawn.subscribe((event) => {
    const player = event.player;
    player.runCommand(`title @s title §6§lمرحباً بك في السودان!`);
    player.runCommand(`title @s subtitle §eأرض النيل والذهب`);
    player.runCommand(`say §6${player.name} §rوصل إلى السودان!`);
});

// عند قتل تمساح النيل
world.afterEvents.entityDie.subscribe((event) => {
    const deadEntity = event.deadEntity;
    const killer = event.damageSource?.damagingEntity;
    
    if (deadEntity.typeId === "sudancraft:nile_crocodile") {
        if (killer && killer.typeId === "minecraft:player") {
            killer.runCommand(`give @s sudancraft:gold_nugget_sudan 3`);
            killer.runCommand(`title @s actionbar §e+3 ذهب سوداني!`);
        }
    }
    
    if (deadEntity.typeId === "sudancraft:desert_scorpion") {
        if (killer && killer.typeId === "minecraft:player") {
            killer.runCommand(`give @s sudancraft:frankincense 1`);
            killer.runCommand(`effect @s poison 5 0 true`);
        }
    }
});

// أوامر خاصة بالسودان
world.beforeEvents.chatSend.subscribe((event) => {
    const player = event.sender;
    const message = event.message;
    
    if (message === "!sudan help") {
        event.cancel = true;
        player.runCommand(`tellraw @s {"rawtext":[{"text":"§6=== أوامر السودان ===\n§r!sudan help - المساعدة\n!sudan kit - طقم السودان\n!sudan spawn crocodile - تمساح النيل\n!sudan spawn warrior - محارب سوداني\n!sudan location - الذهاب للخرطوم"}]}`);
    }
    
    if (message === "!sudan kit") {
        event.cancel = true;
        player.runCommand(`give @s sudancraft:nile_spear 1`);
        player.runCommand(`give @s sudancraft:desert_dagger 1`);
        player.runCommand(`give @s sudancraft:gold_nugget_sudan 20`);
        player.runCommand(`give @s sudancraft:frankincense 5`);
        player.runCommand(`give @s sudancraft:acacia_wood_sudan 64`);
        player.runCommand(`title @s actionbar §6حصلت على طقم السودان!`);
    }
    
    if (message === "!sudan spawn crocodile") {
        event.cancel = true;
        player.runCommand(`summon sudancraft:nile_crocodile ~ ~ ~`);
        player.runCommand(`title @s actionbar §2تم استدعاء تمساح النيل!`);
    }
    
    if (message === "!sudan spawn warrior") {
        event.cancel = true;
        player.runCommand(`summon sudancraft:sudanese_warrior ~ ~ ~`);
        player.runCommand(`title @s actionbar §6تم استدعاء المحارب السوداني!`);
    }
    
    if (message === "!sudan location") {
        event.cancel = true;
        player.runCommand(`tp @s 0 100 0`);
        player.runCommand(`title @s title §6الخرطوم`);
        player.runCommand(`title @s subtitle §eعاصمة السودان`);
    }
});

// توليد الكيانات في المناطق المناسبة
system.runInterval(() => {
    for (const player of world.getAllPlayers()) {
        const biome = player.dimension.getBlock({
            x: Math.floor(player.location.x),
            y: Math.floor(player.location.y),
            z: Math.floor(player.location.z)
        });
        
        // في الصحراء - توليد عقارب
        if (player.location.y > 60 && player.location.y < 80) {
            if (Math.random() < 0.001) {
                player.runCommand(`summon sudancraft:desert_scorpion ~ ~10 ~`);
            }
        }
        
        // في النهر - توليد تماسيح
        if (player.location.y < 64) {
            if (Math.random() < 0.002) {
                player.runCommand(`summon sudancraft:nile_crocodile ~ ~ ~`);
            }
        }
    }
}, 100);
